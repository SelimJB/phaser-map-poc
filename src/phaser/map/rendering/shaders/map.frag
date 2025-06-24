precision highp float;
varying vec2 outTexCoord;

const vec2 Teta=vec2(.001);

const float ProvinceTextureSize=128.;
const float Dim=2.;//Number of sub textures in the ProvincesData texture
const float UVOffset=1./Dim;
const vec2 PatternTextureOffset=vec2(0.,UVOffset);

// INITIALISATION
uniform sampler2D uMainSampler[7];
uniform float uQuantizationLevelAmount;
uniform vec2 uMapResolution;

// UPDATE
uniform float uTime;

// ON POINTER MOVE
uniform vec2 uMousePos;
uniform vec3 uHoveredProvinceColor;
uniform int uHoveredProvinceQuant;

// ON POINTER CLICK
uniform bool uEnablePulsations;
uniform float uPulsationPeriod;
uniform float uPulsationIntensity;
uniform int uSelectedProvinceQuant;
uniform float uClickTime;

// MAP BACKGROUND
//// Idle
uniform float uBlendFactor;
uniform float uContrast;
uniform float uMiddleGray;
uniform float uGrayscaleBlendFactor;
//// Hover
uniform bool uEnableHover;
uniform float uHoverBlendFactor;
uniform float uHoverGrayscaleBlendFactor;
//// Map Border
uniform bool uUseColoredBorders;
uniform float uBorderMapOpacity;
//// Patterns
uniform bool uEnablePatterns;
uniform float uPatternSize;

// MOUSE ILLUMINATION
uniform bool uEnableMouseIllumination;
uniform float uMouseIlluminationRadius;
uniform float uMouseIlluminationIntensity;

// HOVER GLOW
uniform bool uEnableGlow;
uniform vec3 uGlowColor;
uniform float uGlowIntensity;
uniform float uGlowRadius;
uniform float uGlowPulsationRadius;
uniform float uGlowPulsationPeriod;

// HOVER CONTOUR
uniform bool uEnableContour;
uniform float uContourLuminosity;
uniform float uContourIntensity;
uniform float uContourOpacity;
uniform bool uUseContourAntialiasing;
//// Inner
uniform float uInnerContourSize;
//// Outer
uniform bool uUseOuterContour;
uniform float uOuterContourSize;
//// Sampling
uniform int uInnerContourSample;
uniform int uGlowAndOuterContourSample;

const vec3 grayWeights=vec3(.9,.075,.025);

vec4 calculateProvinceFragment(vec4 mapTexture,vec4 provinceColor,float blendFactor,float grayscaleBlendFactor){
    float gray=dot(mapTexture.rgb,grayWeights)*grayscaleBlendFactor+(1.-grayscaleBlendFactor);
    float diff=gray-uMiddleGray;
    float contrasted=clamp(uMiddleGray+diff*uContrast,0.,1.);
    vec3 interpolatedColor=mix(mapTexture.rgb,provinceColor.rgb,contrasted);
    vec4 texInterpolated=vec4(interpolatedColor,1);
    return mix(mapTexture,texInterpolated,blendFactor);
}

vec4 calculateMouseIllumination(vec2 uv,vec4 hoveredProvinceColor){
    vec2 mousePosition=(uMousePos/uMapResolution.xy);
    vec2 aspectRatio=vec2(uMapResolution.x/uMapResolution.y,1.);
    float d=smoothstep(0.,uMouseIlluminationRadius,distance(uv*aspectRatio,mousePosition*aspectRatio));
    return(1.-d)*hoveredProvinceColor*uMouseIlluminationIntensity;
}

vec2 getUVFromQuant(int fragmentQuant,float textureDim){
    float y=float(fragmentQuant)/ProvinceTextureSize;
    float x=mod(float(fragmentQuant),ProvinceTextureSize);
    return(Teta+vec2(x,y))/(ProvinceTextureSize*textureDim);
}

vec4 sampleProvincesDataTexture(vec2 uv){
    return texture2D(uMainSampler[4],uv);
}

// Should be the same as : BitmapTextureHandler.ts -> getQuantizedValue
int quantizedColorLevel(vec4 color){
    float r=floor(color.r*(uQuantizationLevelAmount-1.));
    float g=floor(color.g*(uQuantizationLevelAmount-1.));
    float b=floor(color.b*(uQuantizationLevelAmount-1.));
    
    return int(g+r*uQuantizationLevelAmount+b*uQuantizationLevelAmount*uQuantizationLevelAmount);
}

float easing(float t){
    return(cos(t)+1.)/2.;
}

vec4 addPattern(vec4 provinceFragment,vec4 pattern,vec4 provincePattern){
    float usePattern=provincePattern.a;
    return mix(provinceFragment,provincePattern,usePattern*(1.-pattern.r)*.55);
}

int quantizeFromSmallBitmap(vec2 uv,vec2 offset){
    vec4 contourFragment=texture2D(uMainSampler[3],uv+offset);
    return quantizedColorLevel(contourFragment);
}

vec4 getProvinceColor(vec2 uv)
{
    return sampleProvincesDataTexture(uv);
}

vec4 getProvincePatternColor(vec2 uv)
{
    vec2 patternUV=uv+PatternTextureOffset;
    return sampleProvincesDataTexture(patternUV);
}

// ---------------------------------------

void main(){
    vec2 pos=gl_FragCoord.xy;
    vec2 uv=outTexCoord;
    
    vec4 mapTexture=texture2D(uMainSampler[6],uv);
    vec4 borderMapTexture=texture2D(uMainSampler[2],uv);
    vec4 quantMapTexture=texture2D(uMainSampler[1],uv);
    
    int fragmentQuant=quantizedColorLevel(quantMapTexture);
    
    vec4 provinceFragment=vec4(0.);
    vec4 hoveredProvinceFragment=vec4(0.);
    
    vec4 provinceColor=vec4(0.);
    vec4 hoveredProvinceColor=vec4(uHoveredProvinceColor,1.);
    float hoveredProvinceOpacity=0.;
    
    vec4 glow=vec4(0.);
    
    float innerContourOpacity=0.;
    float outerContourOpacity=0.;
    vec3 contourColor=vec3(0.);
    
    const int maxSampleValue=128;
    float borderMapOpacity=borderMapTexture.a*uBorderMapOpacity;
    float animationTime=uTime-uClickTime;
    
    bool isMatchingHoveredProvince=(fragmentQuant==uHoveredProvinceQuant)&&uHoveredProvinceQuant!=0;
    
    vec4 provincePattern=vec4(0.);
    vec4 pattern=vec4(0.);
    
    if(fragmentQuant==0){
        provinceColor=mapTexture;
    }
    else{
        vec2 quantUV=getUVFromQuant(fragmentQuant,Dim);
        
        provinceColor=getProvinceColor(quantUV);
        
        if(uEnablePatterns)
        {
            provincePattern=getProvincePatternColor(quantUV);
            pattern=texture2D(uMainSampler[5],fract(uv*uPatternSize));
        }
    }
    
    bool isSelected=fragmentQuant==uSelectedProvinceQuant;
    
    bool isMatchingHovered=isMatchingHoveredProvince;
    
    // -----------------------
    // EARLY EXIT OPTIMISATION
    if(!uEnableHover||(!uEnableContour&&!uEnableGlow)){
        if(uEnableHover&&isMatchingHovered){
            provinceFragment=calculateProvinceFragment(mapTexture,hoveredProvinceColor,uHoverBlendFactor,uHoverGrayscaleBlendFactor);
        }
        else{
            provinceFragment=calculateProvinceFragment(mapTexture,provinceColor,uBlendFactor,uGrayscaleBlendFactor);
        }
        
        // PATTERNS
        provinceFragment=addPattern(provinceFragment,pattern,provincePattern);
        
        // PULSATION
        if(uEnablePulsations&&isSelected)
        {
            provinceFragment+=vec4(vec3(easing(animationTime/uPulsationPeriod)*uPulsationIntensity),1.);
        }
        
        // BACKGROUND
        gl_FragColor=provinceFragment;
        
        // BORDERS
        gl_FragColor.rgb=mix(gl_FragColor.rgb,borderMapTexture.rgb,borderMapOpacity);
        
        // MOUSE ILLUMINATION
        // if(uEnableMouseIllumination)
        // gl_FragColor+=calculateMouseIllumination(outTexCoord,hoveredProvinceColor);
        return;
    }
    // -----------------------
    
    // SAMPLING FOR CONTOUR AND GLOW
    vec2 contourOffset=vec2(0.,0.);
    
    bool isContour1=false;
    bool isOuterContour1=false;
    // 2 and 3 are for anti aliasing
    bool isContour2=false;
    bool isOuterContour2=false;
    bool isContour3=false;
    bool isOuterContour3=false;
    
    for(int i=0;i<maxSampleValue;i++){
        if(i>uInnerContourSample-1)break;
        
        float angle=360.*float(i)/float(uInnerContourSample);
        float radiansAngle=radians(angle);
        contourOffset.x=uInnerContourSize*cos(radiansAngle);
        contourOffset.y=uInnerContourSize*sin(radiansAngle);
        
        if(!isContour1||(!isOuterContour1&&uUseOuterContour)){
            int offsetQuant=quantizeFromSmallBitmap(uv,contourOffset);
            
            isContour1=isContour1||(offsetQuant!=fragmentQuant);
            isOuterContour1=isOuterContour1||offsetQuant==uHoveredProvinceQuant;
        }
        
        if(uUseContourAntialiasing){
            if(!isContour2||(!isOuterContour2&&uUseOuterContour)){
                int offsetQuant=quantizeFromSmallBitmap(uv,contourOffset*1.1);
                isContour2=isContour2||offsetQuant!=fragmentQuant;
                isOuterContour2=isOuterContour2||offsetQuant==uHoveredProvinceQuant;
            }
            if(!isContour3||(!isOuterContour3&&uUseOuterContour)){
                int offsetQuant=quantizeFromSmallBitmap(uv,contourOffset*1.2);
                isContour3=isContour3||offsetQuant!=fragmentQuant;
                isOuterContour3=isOuterContour3||offsetQuant==uHoveredProvinceQuant;
            }
        }
    }
    
    // HOVER
    if(uEnableHover&&isMatchingHovered){
        float hoverBlendFactor=uHoverBlendFactor;
        provinceFragment=calculateProvinceFragment(mapTexture,hoveredProvinceColor,hoverBlendFactor,uHoverGrayscaleBlendFactor);
        hoveredProvinceFragment=provinceFragment;
        
        // PATTERNS
        provinceFragment=addPattern(provinceFragment,pattern,provincePattern);
        
        // INNER CONTOUR
        if(uEnableContour)
        {
            contourColor=mix(uHoveredProvinceColor,vec3(1.),uContourLuminosity)*uContourIntensity;
            
            innerContourOpacity=isContour1?1.:0.;
            
            if(uUseContourAntialiasing){
                float innerContour1=isContour1?1.:0.;
                float innerContour2=isContour2?1.:0.;
                float innerContour3=isContour3?1.:0.;
                innerContourOpacity=innerContour1+(innerContour2-innerContour1)*.7+(innerContour3-innerContour2)*.3;
            }
            
            if(!uUseOuterContour){
                provinceFragment.rgb=mix(provinceFragment.rgb,contourColor,innerContourOpacity*uContourOpacity);
            }
        }
    }
    // IDLE
    else{
        provinceFragment=calculateProvinceFragment(mapTexture,provinceColor,uBlendFactor,uGrayscaleBlendFactor);
        
        // PATTERNS
        provinceFragment=addPattern(provinceFragment,pattern,provincePattern);
    }
    
    if(isMatchingHovered){
        hoveredProvinceOpacity=hoveredProvinceColor.a;
    }
    // GLOWING & OUTER CONTOUR
    if(uEnableHover&&uHoveredProvinceQuant!=0&&(uEnableGlow||(uEnableContour&&uUseOuterContour))){
        contourColor=mix(uHoveredProvinceColor,vec3(1.),uContourLuminosity)*uContourIntensity;
        
        float radius=uGlowPulsationRadius*easing(uTime/uGlowPulsationPeriod)+uGlowRadius;
        
        vec4 sum=vec4(0.,0.,0.,0.);
        vec2 offset=vec2(0.,0.);
        
        for(int i=0;i<maxSampleValue;i++){
            if(i>uGlowAndOuterContourSample-1)break;
            
            float angle=360.*float(i)/float(uGlowAndOuterContourSample);
            
            float radiansAngle=radians(angle);
            float cosAngle=cos(radiansAngle);
            float sinAngle=sin(radiansAngle);
            offset.x=radius*cosAngle;
            offset.y=radius*sinAngle;
            
            // GLOW
            if(uEnableGlow){
                vec4 sampleColor1=texture2D(uMainSampler[3],offset+uv);
                vec4 sampleColor2=texture2D(uMainSampler[3],offset*.83+uv);
                vec4 sampleColor3=texture2D(uMainSampler[3],offset*.68+uv);
                if(uHoveredProvinceQuant==quantizedColorLevel(sampleColor1))sum+=sampleColor1;
                if(uHoveredProvinceQuant==quantizedColorLevel(sampleColor2))sum+=sampleColor2;
                if(uHoveredProvinceQuant==quantizedColorLevel(sampleColor3))sum+=sampleColor3;
            }
        }
        
        // GLOW
        if(uEnableGlow){
            sum/=float(uGlowAndOuterContourSample*4);
            vec4 glowTemp=vec4(uHoveredProvinceColor,sum.a);
            glow=mix(vec4(0.,0.,0.,0.),glowTemp,1.-hoveredProvinceOpacity);
        }
        
        // OUTER CONTOUR
        if(uEnableContour&&uUseOuterContour){
            outerContourOpacity=(isOuterContour1?1.:0.)-hoveredProvinceOpacity;
            
            if(uUseContourAntialiasing){
                float outerContour1=(isOuterContour1?1.:0.)-hoveredProvinceOpacity;
                float outerContour2=(isOuterContour2?1.:0.)-hoveredProvinceOpacity;
                float outerContour3=(isOuterContour3?1.:0.)-hoveredProvinceOpacity;
                outerContourOpacity=outerContour1+(outerContour2-outerContour1)*.7+(outerContour3-outerContour2)*.3;
            }
        }
    }
    
    // PULSATION
    if(uEnablePulsations&&isSelected)
    {
        provinceFragment+=vec4(vec3(easing(animationTime/uPulsationPeriod)*uPulsationIntensity),1.);
    }
    
    // BACKGROUND
    gl_FragColor=provinceFragment;
    
    // GLOW
    if(uEnableGlow){
        gl_FragColor.rgb=mix(gl_FragColor.rgb,uGlowColor*uGlowIntensity,glow.a);
    }
    
    // BORDERS
    if(!uUseColoredBorders){
        gl_FragColor.rgb=mix(gl_FragColor.rgb,borderMapTexture.rgb,borderMapOpacity);
    }
    else{
        gl_FragColor.rgb=mix(gl_FragColor.rgb,fragmentQuant==0?borderMapTexture.rgb:provinceColor.rgb,borderMapOpacity);
    }
    
    // CONTOUR
    if(uEnableContour&&uUseOuterContour){
        gl_FragColor.rgb=mix(gl_FragColor.rgb,contourColor,innerContourOpacity*uContourOpacity);
        gl_FragColor.rgb=mix(gl_FragColor.rgb,contourColor,outerContourOpacity*uContourOpacity);
    }
    
    // MOUSE ILLUMINATION
    if(uEnableMouseIllumination)
    gl_FragColor+=calculateMouseIllumination(outTexCoord,hoveredProvinceColor);
}