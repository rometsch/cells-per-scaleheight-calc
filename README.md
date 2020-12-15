[Take me to the calculator!](https://rometsch.github.io/cps-calc/)

# cells-per-scaleheight-calc

A simple calculator for the resolution of disk simulations in terms of cells per scale height in form a of web page.

## Purpose

An important length scale for thin protoplanetary disks is the (pressure) scale height.
This scale height must be resolved properly by hydrodynamics simulations of such disks.

Typical grid based simulations have a simulation box with a certain extend and a certain number of cells in each direction
resulting in a resolution that might or might not vary across the simulation domain.

To resolves physical features in the disk, such as the shock fronts at spiral arms, the resolution must be high enough.
According to simulation lore, the scale height must be resolved by around 8 cells to accurately capture the this process.

Therefore, a key quantity is the resolution in terms of **cells per scale height**.

This web page application aims to be a go to resource providing an easy interface for the, admittedly quite simple, 
calculation oto convert between the resolution in terms of cells per scale height and the cell number and domain extend.