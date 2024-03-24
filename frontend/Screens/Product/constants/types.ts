export interface Theme {
    COLORS: Colors
    FONTS: Fonts
    SIZES: Sizes
  }
  
  export interface Colors {
    black: string
    gray: string
    lightGray: string
    white: string
  }
  
  export interface Fonts {
    body1: Body1
    body2: Body2
    body3: Body3
    body4: Body4
    body5: Body5
    h1: H1
    h2: H2
    h3: H3
    h4: H4
    h5: H5
    largeTitleBold: LargeTitleBold
    navTitle: NavTitle
  }
  
  export interface Body1 {
    fontSize: number
    lineHeight: number
  }
  
  export interface Body2 {
    fontSize: number
    lineHeight: number
  }
  
  export interface Body3 {
    fontSize: number
    lineHeight: number
  }
  
  export interface Body4 {
    fontSize: number
    lineHeight: number
  }
  
  export interface Body5 {
    fontSize: number
    lineHeight: number
  }
  
  export interface H1 {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  
  export interface H2 {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  
  export interface H3 {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  
  export interface H4 {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  
  export interface H5 {
    fontSize: number
    fontWeight: string
    lineHeight: number
  }
  
  export interface LargeTitleBold {
    fontSize: number
  }
  
  export interface NavTitle {
    fontSize: number
    fontWeight: string
  }
  
  export interface Sizes {
    base: number
    body1: number
    body2: number
    body3: number
    body4: number
    body5: number
    font: number
    h1: number
    h2: number
    h3: number
    h4: number
    h5: number
    height: number
    navTitle: number
    padding: number
    radius: number
    width: number
  }