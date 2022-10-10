## Features

- Responsive design
- Linkable image
- Image title
- Light/Dark mode


## Installation

Install my-project with npm

```bash
npm i reactjs-photo-image-gallery
```
    
## Import


```javascript
import { PI_Gallery } from "reactjs-photo-image-gallery";
```
## Usage/Examples

```javascript
const pi_gallery = {
  width: "500px",
  height: "300px",
  timer: 5000,
  pi_list: [
    {
      src: "/images/photo-1.jpg",
      alt: "Photo 1",
      url_enable: true,
      url: "#",
      target: "_blank",
      title: "Photo 1 Title"
    },
    {
      src: "/images/photo-2.jpg",
      alt: "Photo 2",
      url_enable: true,
      url: "#",
      target: "_self",
      title: "Photo 2 Title"
    },
    {
      src: "/images/photo-3.jpg",
      alt: "Photo 3",
      url_enable: false,
      url: "#",
      target: "_blank",
      title: "Photo 3 Title"
    },
  ],
};
```

## Call

```javascript
 <PI_Gallery pi_gallery={pi_gallery} />
```

## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://github.com/hsnacar)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hasan-acar-018007247/)


## Demo

Coming soon


## License

[MIT](https://choosealicense.com/licenses/mit/)

