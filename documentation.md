# 4D Hypercube Portfolio Documentation

## Overview
This document provides comprehensive documentation for a React-based 4D hypercube visualization that serves as an interactive portfolio. The application renders a four-dimensional hypercube (tesseract) that rotates in 4D space and projects onto a 3D canvas, with interactive HTML panels on each face.

## Technical Architecture

### Core Technologies
- React Three Fiber (@react-three/fiber) - React renderer for Three.js
- Three.js - 3D graphics library
- React (@react-three/drei) - Additional React Three Fiber helpers
- TypeScript - Type checking (though currently disabled)

### Key Components

#### 1. App Component
The root component that manages:
- Canvas setup and WebGL context
- Error boundary implementation
- UI controls for rotation, panel display, and framerate
- Global state management

#### 2. HyperCube Component
Main visualization component that:
- Manages 4D to 3D projection
- Handles point mapping and transformation
- Renders vertices and edges
- Contains panel content and positioning

#### 3. QHtml Component
Specialized component for rendering HTML content on cube faces:
- Handles 3D positioning and rotation
- Manages scale and visibility
- Implements hover effects and transitions

## Mathematical Implementation

### 4D to 3D Projection
The projection process occurs in two stages:

1. 4D to 3D Projection (map3 function):
```javascript
const s = 1 / (d4 - w)
res[i][j] = [
    x * s,
    y * s,
    z * s
]
```
- Uses perspective projection with a 4D viewing distance (d4)
- Projects 4D points onto 3D space using homogeneous coordinates

2. Point Transformation:
```javascript
const newX = x * Math.cos(angle) - w * Math.sin(angle)
const newW = x * Math.sin(angle) + w * Math.cos(angle)
```
- Implements 4D rotation matrices
- Rotates points in XW and YZ planes

## Performance Optimization

### FPS Control
- Implements custom FPS limiter
- Allows dynamic adjustment of frame rate
- Manages render loop efficiently

### Error Handling
- Implements React Error Boundary
- Handles WebGL context loss gracefully
- Provides automatic recovery mechanisms

## Interactive Features

### Camera Controls
- Orbit controls for 3D navigation
- Minimum and maximum distance constraints
- Left mouse button: Rotate camera
- Right mouse button: Move camera

### UI Controls
1. Rotation Toggle:
- Enables/disables automatic rotation
- Controls animation state

2. Panel Display:
- Shows/hides HTML panels
- Manages visibility transitions

3. FPS Adjustment:
- Dynamic framerate control
- Performance optimization

## Content Organization

### Panel Layout
The hypercube contains multiple panels displaying:
- Personal information
- Project links
- Social media connections
- Skills and achievements

### Panel Types
1. Information Panels:
- Education details
- Technical skills
- Language proficiency

2. Link Panels:
- Project portfolios
- Social media profiles
- Contact information

3. Interactive Panels:
- Embedded content
- Clickable links
- Dynamic elements

## Styling and Design

### Visual Elements
- Custom color schemes for each panel
- Gradient backgrounds
- Rounded corners and shadows
- Hover effects and transitions

### Responsive Design
- Adaptive panel scaling
- Mobile-friendly interactions
- Dynamic size adjustments

## Development Guidelines

### Best Practices
1. Code Organization:
- Maintain component separation
- Use consistent naming conventions
- Document complex mathematics

2. Performance:
- Monitor frame rates
- Optimize render cycles
- Handle memory management

3. Error Handling:
- Implement graceful degradation
- Provide user feedback
- Log errors appropriately

### Maintenance
1. Regular Updates:
- Check for library updates
- Test browser compatibility
- Update content regularly

2. Testing:
- Verify WebGL context handling
- Test interaction scenarios
- Validate performance metrics

## Deployment

### Requirements
- WebGL2 capable browser
- Modern JavaScript support
- Sufficient GPU capabilities

### Environment Setup
1. Development:
- Node.js environment
- React development tools
- Three.js debugging tools

2. Production:
- Performance monitoring
- Error tracking
- Analytics integration