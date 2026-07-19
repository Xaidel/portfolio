import { useMemo, type CSSProperties, type ReactNode } from 'react'

export type NotchConfig = {
  /** Rendered width of the action button, in px. The recess is derived from this. */
  buttonWidth?: number
  /** Rendered height of the action button, in px. The button's corner radius is half of this. */
  buttonHeight?: number
  /** Recess radius as a multiple of the button's corner radius. 1.4–1.6 leaves an even halo of space around the button. */
  ratio?: number
  /** Horizontal run of the S-shaped blend from the card's bottom edge into the recess, in px. Longer = lazier transition. */
  blend?: number
  /** Radius of the continuous corner where the recess ceiling returns to the card's right edge, in px. Defaults to the recess radius. */
  corner?: number
}

const DEFAULT_NOTCH = {
  buttonWidth: 96,
  buttonHeight: 30,
  ratio: 1.5,
  blend: 40,
} satisfies NotchConfig

// Cubic handle length for a quarter turn, as a fraction of its radius.
// 0.5523 reproduces a circular arc exactly.
const CIRCLE = 0.5523
// Longer handles flatten the apex toward an Apple-style continuous corner.
const SQUIRCLE = 0.64

function round(n: number) {
  return Math.round(n * 100) / 100
}

function buildGeometry(notch: Required<Omit<NotchConfig, 'corner'>> & Pick<NotchConfig, 'corner'>) {
  const { buttonWidth, buttonHeight, blend } = notch
  const br = buttonHeight / 2
  const ratio = Math.max(1.05, notch.ratio)
  // Recess radius: concentric with the button's left end cap.
  const R = ratio * br
  // Continuous corner into the right edge; can't be wider than the flat
  // stretch of ceiling available over the button.
  const fr = Math.max(4, Math.min(notch.corner ?? R, buttonWidth - br))

  // Corner tile, bottom-right aligned. The button sits flush in the
  // card's bottom-right corner, so its left end-cap center is at (cx, capY).
  const tileW = blend + R + (buttonWidth - br)
  const tileH = br + R + fr
  const cx = blend + R
  const capY = tileH - br

  // S-blend handle lengths, chosen for curvature continuity (~G2):
  // `a` puts near-zero curvature where the blend leaves the straight
  // bottom edge; `b` is solved from the cubic's endpoint-curvature
  // formula k = (2/3)·d/b² so the blend arrives at the recess arc with
  // curvature 1/R — the same curvature the circle carries.
  const a = 0.7 * blend
  const b = Math.min(0.9 * br, Math.sqrt((2 / 3) * (blend - a) * R))

  // One continuous path from the card's right edge to its bottom edge:
  //   1. continuous corner off the right edge onto the recess ceiling
  //   2. flat ceiling running over the button with an even gap
  //   3. quarter of the true recess circle around the button's end cap
  //   4. long S-blend from the circle's vertical tangent down to the
  //      bottom edge, arriving horizontally
  // Every junction shares a tangent; 3→4 also shares curvature.
  const carve =
    `C${tileW} ${round(fr * SQUIRCLE)} ` +
    `${round(tileW - fr * (1 - SQUIRCLE))} ${round(fr)} ` +
    `${round(tileW - fr)} ${round(fr)}` +
    `H${round(cx)}` +
    `C${round(cx - R * CIRCLE)} ${round(fr)} ` +
    `${round(blend)} ${round(capY - R * CIRCLE)} ` +
    `${round(blend)} ${round(capY)}` +
    `C${round(blend)} ${round(capY + b)} ${round(a)} ${tileH} 0 ${tileH}`

  const fillPath = `M0 0H${round(tileW)}${carve}Z`
  const edgePath = `M${round(tileW)} 0${carve}`

  const tileSvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(tileW)} ${tileH}">` +
    `<path d="${fillPath}"/></svg>`

  // Three mask layers (with 1px overlaps to kill antialiasing seams):
  // a strip above the notch, a strip left of it, and the SVG corner tile.
  // The tile renders at its natural pixel size, so the curves never
  // stretch no matter how the card resizes.
  const maskImage = `linear-gradient(#000 0 0),linear-gradient(#000 0 0),url("data:image/svg+xml,${encodeURIComponent(tileSvg)}")`
  const maskPosition = 'left top,left bottom,right bottom'
  const maskSize = `100% calc(100% - ${tileH - 1}px),calc(100% - ${round(tileW - 1)}px) ${tileH}px,${round(tileW)}px ${tileH}px`

  const maskStyle: CSSProperties = {
    maskImage,
    maskPosition,
    maskSize,
    maskRepeat: 'no-repeat',
    WebkitMaskImage: maskImage,
    WebkitMaskPosition: maskPosition,
    WebkitMaskSize: maskSize,
    WebkitMaskRepeat: 'no-repeat',
  }

  return { maskStyle, edgePath, tileW: round(tileW), tileH }
}

/**
 * Card with a smooth continuous notch carved into its bottom-right
 * corner. The recess is a true circle concentric with the action
 * button's end cap, reached through a long S-shaped cubic blend, so the
 * button sits half-nested inside the card with an even halo of space
 * around it — no pointed hooks, no intersecting-circle artifacts.
 *
 * The cut is a CSS mask, so the card's own background and border end at
 * the carve and it reads as removed material. A hairline SVG stroke
 * retraces the carved edge so the card's border continues around it.
 */
export default function NotchCard({
  children,
  action,
  notch,
  className = '',
  edgeClassName = 'text-neutral-800',
}: {
  children: ReactNode
  /** Element seated in the recess. It is given the exact configured button box — size it with h-full/w-full. */
  action?: ReactNode
  notch?: NotchConfig
  /** Surface classes — background, border, radius, padding. */
  className?: string
  /** Sets currentColor for the hairline retracing the carved edge; match the surface border color. */
  edgeClassName?: string
}) {
  const config = { ...DEFAULT_NOTCH, ...notch }
  const { maskStyle, edgePath, tileW, tileH } = useMemo(
    () => buildGeometry(config),
    [config.buttonWidth, config.buttonHeight, config.ratio, config.blend, config.corner],
  )

  return (
    <div className="relative">
      <div style={maskStyle} className={className}>
        {children}
      </div>
      <svg
        aria-hidden
        viewBox={`0 0 ${tileW} ${tileH}`}
        width={tileW}
        height={tileH}
        fill="none"
        className={`pointer-events-none absolute right-0 bottom-0 ${edgeClassName}`}
      >
        <path d={edgePath} stroke="currentColor" strokeWidth="1" />
      </svg>
      {action != null && (
        <div
          style={{ width: config.buttonWidth, height: config.buttonHeight }}
          className="absolute right-0 bottom-0"
        >
          {action}
        </div>
      )}
    </div>
  )
}
