import ImagePicker from 'react-native-image-picker';
import axios from 'axios';

export const getImage = (callback) => {

// More info on all the options is below in the API Reference... just some common use cases shown here
  const
  options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  /**
   * The first arg is the options object for customization (it can also be null or omitted for default options),
   * The second arg is the callback which sends object: response (more info in the API Reference)
   */
  ImagePicker.showImagePicker(options, (response) => {

    if (response.didCancel) {
      callback(false);
    } else if (response.error) {
      callback(false);
    } else {
      const base64 = response.data;
      let bodyFormData = new FormData()
      bodyFormData.append('image', base64);
      axios({
        method: 'post',
        headers: {'Content-Type': 'multipart/form-data'},
        baseURL: 'https://api.imgbb.com/1/upload?key=12e5cf0003fdb49650b95dbf5a02ffa9',
        data: bodyFormData,
      }).then(res => {
        callback(res.data);
      }).catch(e => {
        callback(false);
      });
    }
  });
}