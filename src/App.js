import { PI_Gallery } from "reactjs-photo-image-gallery";

function App() {

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
  return (
    <div className="App">
      
      <PI_Gallery pi_gallery={pi_gallery} />
      
    </div>
  );
}

export default App;
