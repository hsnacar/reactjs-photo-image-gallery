## NPM Page 

```bash
[https://www.npmjs.com/package/reactjs-photo-image-gallery](https://www.npmjs.com/package/reactjs-photo-image-gallery)
```

## Installation

```bash
npm i reactjs-photo-image-gallery
```


## Usage

```
import { PI_Gallery } from "reactjs-photo-image-gallery";
```

```javascript
const pi_gallery = {
  width: "500px",
  height: "300px",
  timer: 5000,
  pi_list: [
    {
      src: "/images/photo-1.jpg",
      alt: "Photo 1",
    },
    {
      src: "/images/photo-2.jpg",
      alt: "Photo 2",
    },
    {
      src: "/images/photo-3.jpg",
      alt: "Photo 3",
    },
  ],
};
```

```
 <PI_Gallery pi_gallery={pi_gallery} />
```


## License
[MIT](https://choosealicense.com/licenses/mit/)