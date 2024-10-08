import { appWindow } from "@tauri-apps/api/window";
import "./style.css";

export default function Titlebar() {
  return (
    <div className="titlebar-stoplight">
      <div onClick={() => appWindow.close()} className="titlebar-close">
        <svg x="0px" y="0px" viewBox="0 0 6.4 6.4">
          <polygon
            fill="#4d0000"
            points="6.4,0.8 5.6,0 3.2,2.4 0.8,0 0,0.8 2.4,3.2 0,5.6 0.8,6.4 3.2,4 5.6,6.4 6.4,5.6 4,3.2"
          ></polygon>
        </svg>
      </div>
      <div onClick={() => appWindow.minimize()} className="titlebar-minimize">
        <svg x="0px" y="0px" viewBox="0 0 8 1.1">
          <rect fill="#995700" width="8" height="1.1"></rect>
        </svg>
      </div>
      <div
        onClick={() => appWindow.toggleMaximize()}
        className="titlebar-fullscreen"
      >
        <svg className="fullscreen-svg" x="0px" y="0px" viewBox="0 0 6 5.9">
          <path
            fill="#006400"
            d="M5.4,0h-4L6,4.5V0.6C5.7,0.6,5.3,0.3,5.4,0z"
          ></path>
          <path
            fill="#006400"
            d="M0.6,5.9h4L0,1.4l0,3.9C0.3,5.3,0.6,5.6,0.6,5.9z"
          ></path>
        </svg>
        <svg className="maximize-svg" x="0px" y="0px" viewBox="0 0 7.9 7.9">
          <polygon
            fill="#006400"
            points="7.9,4.5 7.9,3.4 4.5,3.4 4.5,0 3.4,0 3.4,3.4 0,3.4 0,4.5 3.4,4.5 3.4,7.9 4.5,7.9 4.5,4.5"
          ></polygon>
        </svg>
      </div>
    </div>
  );
}
