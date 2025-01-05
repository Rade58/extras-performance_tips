# Extra workshops - Performance Tips

We should target 60fps experience at least.

## Limitations

- CPU
- GPU

## Test performance across multiple devices

## Keep an eye on the weight of the website

# FPS meter: Stats.js

<https://github.com/mrdoob/stats.js>

```
pnpm add stats.js
pnpm add -D @types/stats.js
```

# Disable FPS limit on chrome (command doesn't work for me)

It won't work for me since I'm not on ios or windows

If we are developing on good computers
then we will always have 60 fps
we need to test if performances are good or not good
we need to run chrome without fps limit

- Close chrome completely
- Open the terminal

execute

```zsh
# Unix (Terminal)
open -a "Google Chrome" --args --disable-gpu-vsync --disable-frame-rate-limit

# Windows (Command prompt)
start chrome --args --disable-gpu-vsync --disable-frame-rate-limit
```

commands taken from:
<https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d>

**Doesn't work for me**

# Monitoring draw calls

Can be monitored with Spector.js, by using x-chrome extenssion or you can install package

With spector single frame will be monitored and after few seconds you can see how many commands were executed. More commands, less performant. (In commands tab you can see how many drawCalls is executed)

I tried this already when after I loaded my own model I built with blender

So here, performance can be improved with geometry unification, where you unify all vertices to represent single geometry

# Dispose Manual

<https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects>

# Textures and performances

Textures take a lot of space in the GPU memory especially with the mipmaps
The texture file weight has nothing to do with that, and only the resolution matters
Try to reduce the resolution to the minimum while keeping a decent result (better to use smaller texture)

### Keep a power og 2 resolutions

When resizing, remember to keep a power of 2 resolution for mipmaps
The resolution doesn't have to be a square
If you don't do this Threes will try to fix it by resizing the image to the closest power of 2 resolution

### Use the right format

Using the right format can reduce the loading time
You can use .jpg or .png according to the image and the compression but also the alpha channel

You can use [TinyPNG tool](https://tinypng.com/) to reduce the weight even more

you can use jpeg for example for some displacementMap, it would be compressed to be even lighter than png

You can try the basis format
Basis is a format just like .jpg and .png but the compression is powerful, and the format can be read by the GPU more easily
Unfortunately, it can be hard to generate and it's a lossy compression: <https://github.com/BinomialLLC/basis_universal>

# Geometries

- use Buffer Geometries (I think they are now default)
  You don't need to write SphereBufferGeometry, it is deprecated
  we write SphereGeometry now
- do not update vertices
  very bad, and especially doing it in tick function
- mutualize geometries
  besically resuse geometry for many meshes, and if you need meshes with different sizes, use scale on ones thay need to look differen
- merge geometries
  we did this in blender easily but to lower drawCalls (which you test with Specter.js) when we load geometries in threejs
  you can use [BufferGeeometryUtils](https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils)

# Materials

- you can mutualize materials
- use cheap materials

Some materials like MeshStandardMaterial or MeshPhysicalMaterial need more resources than materials such as MeshBasicMaterial, MeshLambertMaterial or MeshPhongMaterial
Try to use the cheapest materials

# Meshes

- use `InstancedMesh`

If you cannot merge the geometries because you need to have control over the meshes independently, but they are using the same geometry and same material, you can use an [`InstancedMesh`](https://threejs.org/docs/#api/en/objects/InstancedMesh)

It's like a mesh, but you create only one InstancedMesh, and provide a transformation matrix for each "instance" of that mesh
The matrix has to be a [Matrix4](https://threejs.org/docs/?q=Matrix4#api/en/math/Matrix4), and you can apply any transformation by using the various available methods

# Models

- try to use low poly models, and if you need details use normal maps

- use draco compression

If the model has a lot of details with very complex geometries, use the Draco
compression
The drawbacks are a potential freeze when uncompressing the geometry, and you also have to load the Draco libraries

- use gzip

Gzip is a compression happening on the server side
Most of the servers don't gzip files such as .glb, .gltf, .obj, etc.
See if you can figure out how to fix that, depending on the server you are using

I think this can be done with Nginx or apache (I'll look into if you can d othis with node.js for example)

# Cameras

- reduce field of view

When objects are not in the field of view, they won't be rendered (frustum
culling)
That can seem like a tawdry solution, but you can just reduce the camera's field of view

- reduce near and the far

# Renderer

- pixel ratio
  dont just use default pixel ratio obtained with `window.devicePixelRatio`
  use this:

```ts
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```

# Power Preferences

Some devices may be able to switch between different GPU or different GPU
usage
We can give a hint on what power is required when instantiating the WebGLRenderer by specifying a power Preference property

```ts
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  // this means use best possible gpu of users computer
  powerPreference: "high-performance",
});
```

# Antialias

The default antialias is performant, but less performant than no antialias
Only add it if you have visible aliasing and no performance issue

# Post Processing

- limit passes

Each post-processing pass will take as many pixels as the render's resolution (including the pixel ratio) to render
If you have a `1920x1080` resolution with 4 passes and a pixel ratio of `2`, that makes `1920 _ 2 _ 1880 _ 2 _ 4 = 33 177 600` pixels to render Try to regroup your custom passes into one

# Shaders

- specify the precision of floating point numbers

```ts
const shaderMaterial = new THREE.ShaderMaterial({
  precision: "lowp",
});
```

Test if everything will look good on low precision, and use it if you don't have glitches or any quality downgrades

- keep code simple

avoid if statements

make good use of swizzles (.xy, .xyz ...) and use built-in functions

- use textures with shaders

- use defines, like define for PI

you can also set defines from javascript onto ShaderMaterial, just like you did with uniforms

just don't try to change them because material will be recompiled, rember they are not uniforms

- do the calculations in vertex shader (not in javascript)
  and if fragment needs the results, send them with varyings
