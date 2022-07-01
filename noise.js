const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

random.setSeed('CS:GO')

const settings = {
  dimensions: [2048, 2048],
  suffix: random.getSeed(),
}

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6)
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount)

  const createGrid = () => {
    const points = []
    const count = 50

    Array.from({ length: count }, () => Array.from({ length: count })).forEach(
      (_, x) => {
        _.forEach((_, y) => {
          const u = count <= 1 ? 0.5 : x / (count - 1)
          const v = count <= 1 ? 0.5 : y / (count - 1)
          const randomness = random.noise2D(u, v)
          const radius = Math.abs(randomness * 0.2)
          const rotation = randomness * 0.8
          const color = random.pick(palette)
          const position = [u, v]

          points.push({
            color,
            radius,
            rotation,
            position,
          })
        })
      }
    )

    return points
  }

  const points = createGrid().filter(() => random.value() > 0.5)
  const margin = 400
  const ascii = ['=', '.', '-', '+']

  return ({ context, width, height }) => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    points.forEach(({ color, radius, rotation, position }) => {
      const [u, v] = position
      const x = lerp(margin, width - margin, u)
      const y = lerp(margin, height - margin, v)

      context.save()
      context.fillStyle = color
      context.font = `${
        radius * random.noise3D(x, y, margin) * width * 0.8
      }px "Helvetica"`
      context.translate(x, y)
      context.rotate(rotation)
      context.fillText(random.pick(ascii), 0, 0)
      context.restore()
    })
  }
}

canvasSketch(sketch, settings)
