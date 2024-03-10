import {LitElement, html, css} from 'lit';

export class AlertBox extends LitElement {

  static get tag() {
    return 'alert-box';
  }
  constructor() {
    super();
    this.sticky = false;
    this.open = false;
    this.status = "";
    this.message = "Welcome!";
  }
  static get styles() {
    return css`
:host {
    --displayC: none;
    --displayO: flex;
    --bgcolor: #73716a;
    --txtcolor: white;
}
:host([status="notice"]) {
    --bgcolor: #0282fa;
    --txtcolor: white;
}
:host([status = "warning"]) {
    --bgcolor: #ff9a0c;
    --txtcolor: white;
}
:host([status ="alert"]) {
    --bgcolor: #ff0c0c;
    --txtcolor: white;
}
:host([sticky]) {
    position: sticky;
    top: 0;
    z-index: 999;
}
:host([open]) {
    --displayC: unset;
    --displayO: none;
}
.outerContainer {
        background-color: var(--bgcolor);
      } 

.minBox {
    background-color: var(--bgcolor);
    color: black;
    cursor: pointer;
    padding: 20px;
    width: 100%;
    text-align: center;
    justify-content: center;
    font-size: 30px;
    display: var(--displayO);
}

.minBox:hover {
     text-decoration: underline;
}

.expandBox {
  padding: 100px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 30px;
  display: var(--displayC);
}

.alertDate {
    float: none;
    font-size: 1.2rem;
    line-height: 3.rem;
    color: var(--txtcolor);
}
.alertMessage {
    font-size: 1.5rem;
    line-height: 3.rem;
    color: var(--txtcolor);
}
.closeB {
    position: relative;
    float: right;
    color: var(--txtcolor);
    padding: 8px;
    background-color: black;
    border-radius: 12px;
}
.closeB:hover {
    text-decoration: underline;
    cursor: pointer;        
}
`;
  }

  render() {
    return html`

<div class = "outerContainer">  
    <div>
        <button  class="minBox"  @click="${this.openPanel}"> Alert
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="10 10 82 82"
                class="alert-icon"><g transform="translate(-350.099 -428.714)">
                <g transform="translate(350.099 428.714)" fill="none" stroke-width="6">
                    <circle cx="41" cy="41" r="41" stroke="none"></circle>
                    <circle cx="41" cy="41" r="38" fill="none"></circle>
                </g>
                <g transform="translate(384.41 448.566)">
                    <rect width="10.381" height="7.786" transform="translate(0.919 34.336)">

                    </rect>
                    <path d="M6520.672,2327.554h-5.854l-3.21-23.669V2299.2h11.81v4.681Z" transform="translate(-6511.607 -2299.203)" class="alert-icon-min">

                    </path>
                </g>
                </g>
                </svg>
        </button>
    </div>

    <div class="expandBox">
        <span  class="alertMessage" > 
        <slot>
                ${this.message}
            </slot>
        </span>
        <br>
        <br>
        <span  class="alertDate"  ><slot>${this.date}</slot></span>
        <button class="closeB" @click="${this.closePanel}"> x CLOSE</button>
    </div>
</div>  
`;
}

closePanel() {
    this.style.setProperty('--displayC', 'none');
    this.style.setProperty('--displayO', 'flex');    
    this.shadowRoot.querySelector('.minBox').focus();
    localStorage.setItem("opencloseFlag", "close");
}

openPanel() {
    this.style.setProperty('--displayC', 'unset');
    this.style.setProperty('--displayO', 'none');  
    this.shadowRoot.querySelector('.closeB').focus();
    localStorage.setItem("opencloseFlag", "open");
}

firstUpdated() {
    if (localStorage.getItem("opencloseFlag") == "open") {
      this.openPanel(); }
    else if (localStorage.getItem("opencloseFlag") == "close") {
      this.closePanel();  
    }
}

static get properties() {
    return {
      sticky: { type: Boolean, reflect: true },
      open: { type: Boolean, reflect: true },
      status: { type: String, reflect: true },
      message: { type: String },
      date: { type: String },
    };
  }
  

}

globalThis.customElements.define(AlertBox.tag, AlertBox);