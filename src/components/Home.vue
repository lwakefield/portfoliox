<template>
  <content>
      <div class="image" v-for="image in images" 
        :style="{backgroundImage: 'url(data:'+image.type+';base64,'+image.data+')'}"
        @click="selectedImage = image">
      </div>
      <div class="selected-image" v-if="selectedImage"
        :style="{backgroundImage: 'url(data:'+selectedImage.type+';base64,'+selectedImage.data+')'}">
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
export default {
  data () {
    return {selectedImage: undefined}
  },
  firebase: {
    images: new Firebase('https://portfoliox.firebaseio.com/images')
  },
  methods: {
    droppedFile (event) {
      let file = event.target.files[0]
      let fr = new FileReader()
      fr.onload = e => {
        let b64 = btoa(e.target.result)
        this.$firebaseRefs.images.push({type: file.type, data: b64})
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
    }
  }
}
</script>

<style scoped>
  content {
    display: flex;
    flex-flow: row wrap;
  }
  .image {
    width: 20vw;
    height: 20vw;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50% 50%;
    cursor: pointer;
  }
  @media (max-width: 667px) {
    .image {
      width: 100vw;
      height: 100vw;
    }
  }
  .upload {
    font-size: 12rem;
    width: 20vw;
    height: 20vw;
    position: relative;
    border: 1px solid #f7f7f9;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.1s ease;
    opacity: 0.1;
  }
  @media (max-width: 667px) {
    .upload {
      width: 100vw;
      height: 100vw;
    }
  }
  .upload:hover {
    border: 10px solid #f7f7f9;
    opacity: 1;
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
