<template>
  <div class="box">
    <input type="checkbox" id="like" class="field-reactions" />
    <h3 class="text-desc">Press space and after tab key to navigation</h3>
    <label for="like" class="label-reactions">Like</label>
    <div class="toolbox"></div>
    <label class="overlay" for="like"></label>
    <button class="reaction-like">
      <span class="legend-reaction">Like</span>
    </button>
    <button class="reaction-love">
      <span class="legend-reaction">Love</span>
    </button>
    <button class="reaction-haha">
      <span class="legend-reaction">Haha</span>
    </button>
    <button class="reaction-wow">
      <span class="legend-reaction">Wow</span>
    </button>
    <button class="reaction-sad">
      <span class="legend-reaction">Sad</span>
    </button>
    <button class="reaction-angry">
      <span class="legend-reaction">Angry</span>
    </button>
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
.field-reactions {
  &:checked {
    &:focus {
      ~ {
        .text-desc {
          clip: rect(1px, 1px, 1px, 1px);
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
        }
        .label-reactions {
          border-color: transparent;
        }
      }
    }
    ~ {
      [class*='reaction-'] {
        clip: auto;
        overflow: visible;
        opacity: 1;
        transform: scale(0.8) translateY(-40px);
        &:hover {
          transition: all 0.2s ease-in;
          transform: scale(1) translateY(-35px);
          .legend-reaction {
            opacity: 1;
          }
        }
        &:focus {
          transition: all 0.2s ease-in;
          transform: scale(1) translateY(-35px);
          .legend-reaction {
            opacity: 1;
          }
        }
      }
      .toolbox {
        opacity: 1;
        visibility: visible;
      }
      .overlay {
        visibility: visible;
      }
      .reaction-love {
        transition-delay: 0.03s;
      }
      .reaction-haha {
        transition-delay: 0.09s;
      }
      .reaction-wow {
        transition-delay: 0.12s;
      }
      .reaction-sad {
        transition-delay: 0.15s;
      }
      .reaction-angry {
        transition-delay: 0.18s;
      }
    }
  }
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  &:focus {
    ~ {
      .text-desc {
        clip: auto;
        overflow: visible;
        opacity: 1;
      }
      .label-reactions {
        border-color: rgba(88, 144, 255, 0.3);
      }
    }
  }
}
[class*='reaction-'] {
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  background-image: url(http://deividmarques.github.io/facebook-reactions-css/assets/images/facebook-reactions.png);
  background-color: transparent;
  display: block;
  cursor: pointer;
  height: 48px;
  position: absolute;
  width: 48px;
  z-index: 11;
  top: -28;
  transform-origin: 50% 100%;
  transform: scale(0.1);
  transition: all 0.3s;
  outline: none;
  will-change: transform;
  opacity: 0;
}
.text-desc {
  clip: rect(1px, 1px, 1px, 1px);
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  font-weight: normal;
  text-align: center;
  transform: translateY(-50px);
  white-space: nowrap;
  font-size: 13px;
  width: 100%;
}
.box {
  background: red;
  &:hover {
    [class*='reaction-'] {
      clip: auto;
      overflow: visible;
      opacity: 1;
      transform: scale(0.8) translateY(-40px);
      &:hover {
        transition: all 0.2s ease-in;
        transform: scale(1) translateY(-35px);
        .legend-reaction {
          opacity: 1;
        }
      }
      &:focus {
        transition: all 0.2s ease-in;
        transform: scale(1) translateY(-35px);
        .legend-reaction {
          opacity: 1;
        }
      }
    }
    .toolbox {
      opacity: 1;
      visibility: visible;
    }
    .reaction-love {
      transition-delay: 0.06s;
    }
    .reaction-haha {
      transition-delay: 0.09s;
    }
    .reaction-wow {
      transition-delay: 0.12s;
    }
    .reaction-sad {
      transition-delay: 0.15s;
    }
    .reaction-angry {
      transition-delay: 0.18s;
    }
  }
  position: absolute;
  left: calc(50% - 150px);
  top: calc(50% - 50px);
  width: 300px;
}
.main-title {
  background: #3a5795;
  padding: 10px;
  color: #fff;
  text-align: center;
  font-size: 16px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  visibility: hidden;
}
.label-reactions {
  background: url(https://cdn4.iconfinder.com/data/icons/facebook-likes/100/1.png)
    no-repeat 0 0;
  border: 2px dotted transparent;
  display: block;
  height: 100px;
  margin: 0 auto;
  width: 100px;
  color: transparent;
  cursor: pointer;
}
.toolbox {
  background: #fff;
  height: 52px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 0 2px 2px rgba(0, 0, 0, 0.15);
  width: 300px;
  border-radius: 40px;
  top: -30px;
  left: 0;
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s;
}
.legend-reaction {
  background: rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  box-sizing: border-box;
  color: #fff;
  display: inline-block;
  font-size: 11px;
  text-overflow: ellipsis;
  font-weight: bold;
  line-height: 20px;
  max-width: 100%;
  opacity: 0;
  overflow: hidden;
  padding: 0 6px;
  transition: opacity 50ms ease;
  left: 50%;
  position: absolute;
  text-align: center;
  top: -28px;
  transform: translateX(-50%);
}
.reaction-like {
  left: 0;
  background-position: 0 -144px;
}
.reaction-love {
  background-position: -48px 0;
  left: 50px;
}
.reaction-haha {
  background-position: -96px 0;
  left: 100px;
}
.reaction-wow {
  background-position: -144px 0;
  left: 150px;
}
.reaction-sad {
  background-position: -192px 0;
  left: 200px;
}
.reaction-angry {
  background-position: -240px 0;
  left: 250px;
}
</style>
