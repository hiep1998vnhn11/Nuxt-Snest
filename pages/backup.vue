<template>
  <div class="emoji-container">
    <div class="emoji  emoji--like">
      <div class="emoji__hand">
        <div class="emoji__thumb"></div>
      </div>
    </div>
    <div class="emoji  emoji--love">
      <div class="emoji__heart"></div>
    </div>
    <div class="emoji  emoji--haha">
      <div class="emoji__face">
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth">
          <div class="emoji__tongue"></div>
        </div>
      </div>
    </div>
    <div class="emoji  emoji--yay">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--wow">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--sad">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
    <div class="emoji  emoji--angry">
      <div class="emoji__face">
        <div class="emoji__eyebrows"></div>
        <div class="emoji__eyes"></div>
        <div class="emoji__mouth"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {},
  created() {},
  mounted() {},
  computed: {}
}
</script>
<style lang="scss" scoped>
$emoji-base-color: #ffda6a;
$emoji-like-color: #548dff;
$emoji-love-color: #f55064;
$emoji-angry-color: #d5234c;
$emoji-white-color: #ffffff;
$emoji-black-color: #000000;
$emoji-text-color: #000;

.emoji-container {
  margin: 0;
  width: 1200;
  background: green;
  max-width: 100%;
  text-align: center;
  font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.emoji {
  width: 30px;
  height: 30px;
  // margin: 3.75px 3.75px 10px;
  margin: 45px 45px 120px;
  background: $emoji-base-color;
  display: inline-block;
  border-radius: 50%;
  position: relative;
  transition: 0.5s ease-in-out;
  transform: scale(1.2);
  &:after {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -10px;
    font-size: 0.5rem;
    width: 15px;
    left: calc(50% - 7.5px);
    color: $emoji-text-color;
    display: none;
  }
  &:hover {
    transform: scale(1.5);
    transition: 0.5s ease-in-out;
    &::after {
      display: block;
    }
  }
}

.emoji__face,
.emoji__eyebrows,
.emoji__eyes,
.emoji__mouth,
.emoji__tongue,
.emoji__heart,
.emoji__hand,
.emoji__thumb {
  position: absolute;

  &:before,
  &:after {
    position: absolute;
    content: '';
  }
}

.emoji__face {
  width: inherit;
  height: inherit;
}

.emoji--like {
  background: $emoji-like-color;

  &:after {
    content: 'Like';
  }

  .emoji__hand {
    left: 6.25px;
    bottom: 7.5px;
    width: 5px;
    height: 10px;
    background: $emoji-white-color;
    border-radius: 1.25px;
    z-index: 0;
    animation: hands-up 2s linear infinite;

    &:before {
      left: 6.25px;
      bottom: 1.25px;
      width: 10px;
      background: inherit;
      height: 2.5px;
      border-radius: 0.5px 2.5px 2.5px 0.5px;
      box-shadow: 0.25px -2.25px 0 0.25px $emoji-white-color,
        0.5px -4.75px 0 0.5px $emoji-white-color,
        0.75px -7.25px 0 0.75px $emoji-white-color;
    }
  }

  .emoji__thumb {
    border-bottom: 5px solid $emoji-white-color;
    border-left: 5px solid transparent;
    top: -6.25px;
    right: -6.25px;
    z-index: 2;
    transform: rotate(5deg);
    transform-origin: 0% 100%;
    animation: thumbs-up 2s linear infinite;

    &:before {
      border-radius: 50% 50% 0 0;
      background: $emoji-white-color;
      width: 2.5px;
      height: 3px;
      left: -2.5px;
      top: -2px;
      transform: rotate(-15deg);
      transform-origin: 100% 100%;
      box-shadow: -0.25px 1px 0 -0.25px $emoji-white-color;
    }
  }
}

.emoji--love {
  background: $emoji-love-color;

  &:after {
    content: 'Love';
  }

  .emoji__heart {
    left: calc(50% - 10px);
    top: calc(50% - 10px);
    width: 20px;
    height: 20px;
    animation: heart-beat 1s linear infinite alternate;

    &:before,
    &:after {
      left: calc(50% - 5px);
      top: calc(50% - 8px);
      width: 10px;
      height: 16px;
      background: $emoji-white-color;
      border-radius: 5px 5px 0 0;
    }

    &:before {
      transform: translate(5px) rotate(-45deg);
      transform-origin: 0 100%;
    }

    &:after {
      transform: translate(-5px) rotate(45deg);
      transform-origin: 100% 100%;
    }
  }
}

.emoji--haha {
  &:after {
    content: 'Haha';
  }

  .emoji__face {
    animation: haha-face 2s linear infinite;
  }

  .emoji__eyes {
    width: 8.5px;
    height: 1.5px;
    border-radius: 0.5px;
    left: calc(50% - 3.25px);
    top: 8.75px;
    transform: rotate(20deg);
    background: transparent;
    box-shadow: -8.25px 1.25px 0 0 $emoji-black-color,
      8.25px -1.25px 0 0 $emoji-black-color;

    &:after {
      left: 0;
      top: 0;
      width: 8.5px;
      height: 1.5px;
      border-radius: 0.5px;
      transform: rotate(-40deg);
      background: transparent;
      box-shadow: -8.25px -1.25px 0 0 $emoji-black-color,
        8.25px 1.25px 0 0 $emoji-black-color;
    }
  }

  .emoji__mouth {
    width: 20px;
    height: 10px;
    left: calc(50% - 10px);
    top: 50%;
    background: $emoji-black-color;
    border-radius: 0 0 10px 10px;
    overflow: hidden;
    z-index: 1;
    animation: haha-mouth 2s linear infinite;
  }

  .emoji__tongue {
    width: 17.5px;
    height: 7.5px;
    background: $emoji-love-color;
    left: calc(50% - 8.75px);
    bottom: -2.5px;
    border-radius: 50%;
  }
}

.emoji--yay {
  &:after {
    content: 'Yay';
    animation: yay-reverse 1s linear infinite;
  }

  .emoji__face {
    animation: yay 1s linear infinite alternate;
  }

  .emoji__eyebrows {
    left: calc(50% - 0.75px);
    top: 7.5px;
    height: 1.5px;
    width: 1.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: -1.5px 0 0 0 $emoji-black-color, -9px 0 0 0px $emoji-black-color,
      1.5px 0 0 0 $emoji-black-color, 9px 0 0 0px $emoji-black-color;

    &:before,
    &:after {
      width: 9px;
      height: 4.5px;
      border-radius: 15px 15px 0 0;
      background: transparent;
      border: 1.5px solid black;
      box-sizing: border-box;
      border-bottom: 0;
      bottom: 0.75px;
      left: calc(50% - 4.5px);
    }

    &:before {
      margin-left: -5.25px;
    }

    &:after {
      margin-left: 5.25px;
    }
  }

  .emoji__mouth {
    top: 15px;
    background: transparent;
    left: 50%;

    &:after {
      width: 20px;
      height: 20px;
      left: calc(50% - 10px);
      top: -18.75px;
      border-radius: 50%;
      background: transparent;
      border: 1.5px solid $emoji-black-color;
      box-sizing: border-box;
      border-top-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      z-index: 1;
    }

    &:before {
      width: 1.5px;
      height: 1.5px;
      background: transparent;
      border-radius: 50%;
      bottom: 1.25px;
      left: calc(50% - 0.75px);
      box-shadow: -6.25px 0 0 0 $emoji-black-color,
        6.25px 0 0 0 $emoji-black-color, -35px -2px 30px 10px $emoji-angry-color,
        8.75px -0.5px 7.5px 2.5px $emoji-angry-color;
    }
  }
}

.emoji--wow {
  &:after {
    content: 'Wow';
  }
  .emoji__face {
    animation: wow-face 3s linear infinite;
  }

  .emoji__eyebrows {
    left: calc(50% - 0.75px);
    height: 1.5px;
    width: 1.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: -4.5px 0 0 0 $emoji-black-color,
      -8.25px 0 0 0 $emoji-black-color, 4.5px 0 0 0 $emoji-black-color,
      8.25px 0 0 0 $emoji-black-color;
    animation: wow-brow 3s linear infinite;

    &:before,
    &:after {
      width: 6px;
      height: 5px;
      border: 1.5px solid $emoji-black-color;
      box-sizing: border-box;
      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      top: -0.75px;
      left: calc(50% - 3px);
    }

    &:before {
      margin-left: -6.25px;
    }

    &:after {
      margin-left: 6.25px;
    }
  }

  .emoji__eyes {
    width: 4px;
    height: 6px;
    left: calc(50% - 2px);
    top: 8.75px;
    border-radius: 50%;
    background: transparent;
    box-shadow: 6.25px 0 0 0 $emoji-black-color,
      -6.25px 0 0 0 $emoji-black-color;
  }

  .emoji__mouth {
    width: 7.5px;
    height: 11.25px;
    left: calc(50% - 3.75px);
    top: 50%;
    border-radius: 50%;
    background: $emoji-black-color;
    animation: wow-mouth 3s linear infinite;
  }
}

.emoji--sad {
  &:after {
    content: 'Sad';
  }

  .emoji__face {
    animation: sad-face 2s ease-in infinite;
  }

  .emoji__eyebrows {
    left: calc(50% - 0.75px);
    top: 8.75px;
    height: 1.5px;
    width: 1.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: -10px 2.25px 0 0 $emoji-black-color,
      -6.25px 0 0 0 $emoji-black-color, 6.25px 0 0 0 $emoji-black-color,
      10px 2.25px 0 0 $emoji-black-color;

    &:before,
    &:after {
      width: 7.5px;
      height: 5px;
      border: 1.5px solid $emoji-black-color;
      box-sizing: border-box;
      border-radius: 50%;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      top: 0.5px;
      left: calc(50% - 3.75px);
    }

    &:before {
      margin-left: -7.5px;
      transform: rotate(-30deg);
    }

    &:after {
      margin-left: 7.5px;
      transform: rotate(30deg);
    }
  }

  .emoji__eyes {
    width: 3.5px;
    height: 4px;
    left: calc(50% - 1.75px);
    top: 12.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: 6.25px 0 0 0 $emoji-black-color,
      -6.25px 0 0 0 $emoji-black-color;

    &:after {
      background: $emoji-like-color;
      width: 3px;
      height: 3px;
      margin-left: 1.5px;
      border-radius: 0 100% 40% 50% / 0 50% 40% 100%;
      transform-origin: 0% 0%;
      animation: tear-drop 2s ease-in infinite;
    }
  }

  .emoji__mouth {
    width: 15px;
    height: 20px;
    left: calc(50% - 7.5px);
    top: 20px;
    box-sizing: border-box;
    border: 1.5px solid $emoji-black-color;
    border-radius: 50%;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    background: transparent;
    animation: sad-mouth 2s ease-in infinite;

    &:after {
      width: 1.5px;
      height: 1.5px;
      background: transparent;
      border-radius: 50%;
      top: 1px;
      left: calc(50% - 0.75px);
      box-shadow: -4.5px 0 0 0 $emoji-black-color,
        4.5px 0 0 0 $emoji-black-color;
    }
  }
}

.emoji--angry {
  background: linear-gradient($emoji-angry-color -10%, $emoji-base-color);
  background-size: 100%;
  animation: angry-color 2s ease-in infinite;

  &:after {
    content: 'Angry';
  }

  .emoji__face {
    animation: angry-face 2s ease-in infinite;
  }

  .emoji__eyebrows {
    left: calc(50% - 0.75px);
    top: 13.75px;
    height: 1.5px;
    width: 1.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: -11px 1.25px 0 0 $emoji-black-color,
      -1.75px 4px 0 0 $emoji-black-color, 1.75px 4px 0 0 $emoji-black-color,
      11px 1.25px 0 0 $emoji-black-color;

    &:before,
    &:after {
      width: 12.5px;
      height: 5px;
      border: 1.5px solid $emoji-black-color;
      box-sizing: border-box;
      border-radius: 50%;
      border-top-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      top: 0;
      left: calc(50% - 6.25px);
    }

    &:before {
      margin-left: -6.25px;
      transform: rotate(15deg);
    }

    &:after {
      margin-left: 6.25px;
      transform: rotate(-15deg);
    }
  }

  .emoji__eyes {
    width: 3px;
    height: 3px;
    left: calc(50% - 1.5px);
    top: 17.5px;
    border-radius: 50%;
    background: transparent;
    box-shadow: 6.25px 0 0 0 $emoji-black-color,
      -6.25px 0 0 0 $emoji-black-color;
  }

  .emoji__mouth {
    width: 9px;
    height: 4.5px;
    left: calc(50% - 4.5px);
    bottom: 3.75px;
    background: $emoji-black-color;
    border-radius: 50%;
    animation: angry-mouth 2s ease-in infinite;
  }
}

@keyframes heart-beat {
  25% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.6);
  }
}

@keyframes haha-face {
  10%,
  30%,
  50% {
    transform: translateY(6.25px);
  }
  20%,
  40% {
    transform: translateY(3.75px);
  }
  60%,
  80% {
    transform: translateY(0);
  }
  70%,
  90% {
    transform: translateY(-2.5px);
  }
}

@keyframes haha-mouth {
  10%,
  30%,
  50% {
    transform: scale(0.6);
    top: 45%;
  }
  20%,
  40% {
    transform: scale(0.8);
    top: 45%;
  }
  60%,
  80% {
    transform: scale(1);
    top: 50%;
  }
  70% {
    transform: scale(1.2);
    top: 50%;
  }
  90% {
    transform: scale(1.1);
    top: 50%;
  }
}

@keyframes yay {
  25% {
    transform: rotate(-15deg);
  }
  75% {
    transform: rotate(15deg);
  }
}

@keyframes wow-face {
  15%,
  25% {
    transform: rotate(20deg) translateX(-6.25px);
  }
  45%,
  65% {
    transform: rotate(-20deg) translateX(6.25px);
  }
  75%,
  100% {
    transform: rotate(0deg) translateX(0);
  }
}

@keyframes wow-brow {
  15%,
  65% {
    top: 6.25px;
  }
  75%,
  100%,
  0% {
    top: 3.75px;
  }
}

@keyframes wow-mouth {
  10%,
  30% {
    width: 5px;
    height: 5px;
    left: calc(50% - 2.5px);
  }
  50%,
  70% {
    width: 7.5px;
    height: 10px;
    left: calc(50% - 3.75px);
  }
  75%,
  100% {
    height: 12.5px;
  }
}

@keyframes sad-face {
  25%,
  35% {
    top: -3.75px;
  }
  55%,
  95% {
    top: 2.5px;
  }
  100%,
  0% {
    top: 0;
  }
}

@keyframes sad-mouth {
  25%,
  35% {
    transform: scale(0.85);
    top: 17.5px;
  }
  55%,
  100%,
  0% {
    transform: scale(1);
    top: 20px;
  }
}

@keyframes tear-drop {
  0%,
  100% {
    display: block;
    left: 8.75px;
    top: 3.75px;
    transform: rotate(45deg) scale(0);
  }
  25% {
    display: block;
    left: 8.75px;
    transform: rotate(45deg) scale(2);
  }
  49.9% {
    display: block;
    left: 8.75px;
    top: 16.25px;
    transform: rotate(45deg) scale(0);
  }
  50% {
    display: block;
    left: -8.75px;
    top: 3.75px;
    transform: rotate(45deg) scale(0);
  }
  75% {
    display: block;
    left: -8.75px;
    transform: rotate(45deg) scale(2);
  }
  99.9% {
    display: block;
    left: -8.75px;
    top: 16.25px;
    transform: rotate(45deg) scale(0);
  }
}

@keyframes hands-up {
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(-15deg) translateY(-2.5px);
  }
  75%,
  100% {
    transform: rotate(0deg);
  }
}

@keyframes thumbs-up {
  25% {
    transform: rotate(20deg);
  }
  50%,
  100% {
    transform: rotate(5deg);
  }
}

@keyframes angry-color {
  45%,
  60% {
    background-size: 250%;
  }
  85%,
  100%,
  0% {
    background-size: 100%;
  }
}

@keyframes angry-face {
  35%,
  60% {
    transform: translateX(0) translateY(2.5px) scale(0.9);
  }
  40%,
  50% {
    transform: translateX(-5px) translateY(2.5px) scale(0.9);
  }
  45%,
  55% {
    transform: translateX(5px) translateY(2.5px) scale(0.9);
  }
}

@keyframes angry-mouth {
  25%,
  50% {
    height: 1.5px;
    bottom: 6.25px;
  }
}
</style>
