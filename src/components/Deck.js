import React, { useState } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";

import Card from "./Card";

import "../styles/Deck.css";

function Deck(props) {
  const to = i => ({
    x: 0,
    y: 0,
    scale: 1,
    rot: 0,
    delay: i * 100
  });
  
  const from = i => ({ rot: 0, scale: 1, y: 0 });

  const trans = (r, s) =>
    `perspective(1500px) rotateX(30deg) rotateY(${r /
      10}deg) rotateZ(${r}deg) scale(${s})`;

  const [gone] = useState(() => new Set());

  const [animatedProps, set] = useSprings(props.products.length, i => ({
    ...to(i),
    from: from(i)
  }));

  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.2;

      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) {
        dir === -1 ? props.onDislike() : props.onLike()
        gone.add(index);
      }

      set(i => {
        if (index !== i) return;
        const isGone = gone.has(index);

        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;

        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);

        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      if (!down && gone.size === props.products.length) {
        setTimeout(() => {
          props.onReset()
          gone.clear() || set(i => to(i))
        }, 600);
      }
    }
  );

  return animatedProps.map(({ x, y, rot, scale }, i) => (
    <Card
      key={i}
      i={i}
      x={x}
      y={y}
      rot={rot}
      scale={scale}
      trans={trans}
      data={props.products}
      bind={bind}
    />
  ));
}

export default Deck;
