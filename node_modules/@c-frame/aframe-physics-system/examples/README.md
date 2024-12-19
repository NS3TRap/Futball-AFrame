# Examples

To help demonstrate the features and capabilities of `aframe-physics-system`
the following collection of examples have been prepared.

Examples marked "Broken" do not currently function as expected, due to open bugs.
Examples marked "Limited" have limitations in terms of what function can be exercised (e.g. due to constraints on mouse interaction, or limitations with particular driver implementations)

| Example                                                      | Cannon                                 | Cannon Worker                                          | Ammo                                     |
| ------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------ | ---------------------------------------- |
| Demonstration of many features in a single example.          | [**OK**](cannon/sandbox.html)     | [**Broken**](cannon-worker/sandbox.html)           | [**OK**](ammo/sandbox.html)         |
| Construct a [compound shape](../README.md#shape) and simulate collision with a ground plane. | [**OK**](cannon/compound.html)    | [**Broken**](cannon-worker/compound.html)          | [**OK**](ammo/compound.html) |
| Demonstration of many constraints including cone twist, hinge, lock, point to point, slider (Ammo only) and distance (Cannon only) constraints. | [**OK**](cannon/constraints.html) | [**Broken**](cannon-worker/constraints.html) | [**OK**](ammo/constraints.html) |
| Bounce simulation with [restitution (bounciness)](../README.md#system-configuration) of 1. | [**OK**](cannon/materials.html)   | [**Limited**](cannon-worker/materials.html)   | [**OK**](ammo/materials.html) |
| Four vertical [springs](../README.md#spring) each between two boxes with an assortment of damping and stiffness values | [**OK**](cannon/spring.html)     | [**OK**](cannon-worker/spring.html)              | [**Limited**](ammo/spring.html) |
| Apply [strong impulse](../README.md#using-the-cannonjs-api) to a cube when the user clicks with a mouse. Cubes are arranged in four 4x3 walls. | [**OK**](cannon/stress.html)      | [**Limited**](cannon-worker/stress.html)      | [**OK**](ammo/stress.html) |
| Animate a long wall moving along the z-axis along the initial view direction. | [**OK**](cannon/sweeper.html)     | [**Broken**](cannon-worker/sweeper.html)           | [**OK**](ammo/sweeper.html) |
| Remove a [dynamic body](../README.md#dynamic-body-and-static-body) from the scene after 100 frames | [**OK**](cannon/ttl.html)         | [**Broken**](cannon-worker/ttl.html)               | [**OK**](ammo/ttl.html) |
| Performance test: 100 balls rolling down a peg board, with timing data from physics engine. | [**OK**](cannon/perf.html) | [**Broken**](cannon-worker/perf.html) | [**OK**](ammo/perf.html) |

