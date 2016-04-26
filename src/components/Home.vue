<template>
  <content>
      <div class="image" v-for="image in images" 
        :style="{backgroundImage: 'url(data:'+image.type+';base64,'+image.data+')'}"
        @click="selectedImage = image">
      </div>
      <div class="selected-image" v-if="selectedImage"
        :style="{backgroundImage: 'url(data:'+selectedImage.type+';base64,'+selectedImage.data+')'}"
        transition="fade">
        <button class="close-selected-image" @click="selectedImage = undefined">x</button>
        <button class="prev-image" @click="prevImage"><</button>
        <button class="next-image" @click="nextImage">></button>
      </div>
      <div class="upload" v-if="auth">
          <input type="file" @change.stop.prevent="droppedFile($event)">
          <span class="plus"></span>
      </div>
  </content>
</template>

<script>
import Firebase from 'firebase'
import crypto from 'crypto'
import localforage from 'localforage'
export default {
  data () {
    return {images: [], selectedImage: undefined}
  },
  firebase: {
    imageIndex: new Firebase('https://portfoliox.firebaseio.com/image_index')
  },
  methods: {
    droppedFile (event) {
      let file = event.target.files[0]
      let fr = new FileReader()
      fr.onload = e => {
        let b64 = btoa(e.target.result)
        this.$firebaseRefs.root.child('images').push({type: file.type, data: b64})
        .then(data => {
          let hash = crypto.createHash('sha256').update(e.target.result)
          let digest = hash.digest('hex')
          this.$firebaseRefs.imageIndex.child(data.key()).set(digest)
        })
      }
      fr.readAsBinaryString(file)
    },
    nextImage () {
      let index = this.images.findIndex(i => i === this.selectedImage)
      if (index === this.images.length - 1) this.selectedImage = this.images[0]
      else this.selectedImage = this.images[index + 1]
    },
    prevImage () {
      let index = this.images.findIndex(i => i === this.selectedImage)
      if (index === 0) this.selectedImage = this.images[this.images.length - 1]
      else this.selectedImage = this.images[index - 1]
    },
    updateImages (index) {
      let imageIndex = Object.keys(index).map(key => {
        return {key, hash: index[key]}
      })

      this.images = []
      imageIndex.forEach(val => {
        let key = val.key
        let hash = val.hash
        localforage.getItem(`cachedImage.${key}`).then(img => {
          // img does not exist in cache, or it has needs updating
          if (!img || img.hash !== hash) {
            this.$firebaseRefs.root.child(`images/${key}`).once('value', imageSnap => {
              let image = localforage.setItem(`cachedImage.${key}`, Object.assign({hash},
                imageSnap.val()))
              this.images.push(image)
            })
          } else {
            this.images.push(img)
          }
        })
      })
    }
  },
  ready () {
    // inital load from cache
    localforage.iterate((key, value) => {
      if (!key.startsWith('cachedImage.')) return
      this.images.push(value)
    })

    // update images for any changes
    this.$firebaseRefs.imageIndex.on('value', indexSnap => {
      if (!indexSnap.val()) return
      this.updateImages(indexSnap.val())
    })
  }
}
</script>

<style scoped>
  content {
    display: flex;
    flex-flow: row wrap;
  }
  .image,
  .upload {
    width: calc(100vw / 3);
    height: calc(100vw / (3 * 1.618));
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    cursor: pointer;
    border: 0px solid #f7f7f9;
    transition: all 0.2s ease;
  }
  @media (max-width: 667px) {
    .image,
    .upload {
      width: 100vw;
      height: calc(100vw / 1.618);
    }
  }
  .image:hover,
  .upload:hover {
    border: 10px solid #f7f7f9;
    opacity: 1;
  }
  .upload {
    font-size: 12rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.1;
  }
  input[type="file"] {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .plus:after {
    content: '+';
    display: block;
    font-family: Menlo;
  }
  .fade-transition {
    transition: 0.3s all ease;
    opacity: 1;
    transform: scale(1);
  }
  .fade-enter,
  .fade-leave {
    opacity: 0;
    transform: scale(0);
  }
  .selected-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(55, 58, 60, 0.7);
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: contain;
    z-index: 1;
  }
  .close-selected-image {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-family: Menlo;
    font-size: 2rem;
    cursor: pointer;
  }
  .next-image,
  .prev-image {
    background-color: rgba(55, 58, 60, 0.7);
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    font-family: Menlo;
    cursor: pointer;
  }
  .next-image {
    right: 0;
  }
  .prev-image {
    .left: 0;
  }
</style>
