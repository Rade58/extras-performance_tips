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
