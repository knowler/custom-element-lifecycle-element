export class CustomElementLifecycleElement extends HTMLElement {
	static #template = document.createElement("template");
	static #styleSheet = new CSSStyleSheet();

	/* Registration helper */
	static tagName = "custom-element-lifecycle";
	static define(tagName) {
		if (tagName) this.tagName = tagName;

		if (!window.customElements.get(this.tagName)) {
			window[this.name] = this;
			console.log(`Registering <${this.tagName}>`);
			window.customElements.define(this.tagName, this);
		}
	}

	static get defined() {
		return window.customElements.whenDefined(this.tagName);
	}

	static instances = 0;

	static {
		console.log(`${this.name} class initialized`);
		this.defined.then(() => console.log(`<${this.tagName}> defined`));

		this.#template.innerHTML = `
			<span>Custom Element Lifecycle</span>
			<slot></slot>
		`;
		const css = String.raw;
		this.#styleSheet.replaceSync(css`
			:host {
				display: inline-block;
				background-color: DeepPink;
				color: White;
				font-family: system-ui;
				font-weight: 500;
				padding-inline: 0.5rem;
				padding-block: 0.25rem;
				border: 1px solid black;
				margin-block: 0.5em;
			}

			:host([with-an-attribute="hello"]) {
				background-color: DodgerBlue;
			}
		`);
	}

	constructor() {
		super();
		this.instanceId = ++this.constructor.instances;
		this.log(" constructed", { isConnected: this.isConnected });
		this.attachShadow({ mode: "open" });
		this.shadowRoot.adoptedStyleSheets = [this.constructor.#styleSheet];
		this.shadowRoot.appendChild(this.constructor.#template.content.cloneNode(true));

		this.shadowRoot.querySelector("slot").addEventListener("slotchange", this);
	}

	handleEvent(event) {
		if (event.type === "slotchange") {
			this.log(` slotchange`, { isConnected: this.isConnected });
		}
	}

	connectedCallback() {
		this.log(" connected");
	}

	disconnectedCallback() {
		this.log(" disconnected");
	}

	adoptedCallback() {
		this.log(" adopted");
	}

	static get observedAttributes() { return ["with-an-attribute"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		this.log(`’s ${name} attribute was changed from ${oldValue} to ${newValue}`, { isConnected: this.isConnected });
	}

	/* Form Associated Custom Element Lifecycle */

	static formAssociated = true;

	formAssociatedCallback(form) {
		this.log(" associated with form", form);
	}

	formResetCallback() {
		this.log("’s form was reset");
	}

	formDisabledCallback(disabled) {
		this.log(` was ${disabled ? "disabled" : "enabled"}`);
	}

	formStateRestoreCallback(state, mode) {
		this.log(`’s form was ${mode ? "restored" : "autofilled"}`);
	}

	/**
	 * Cheating a little by logging a little late in order to show the registration event at the correct time.
	 */
	log(message, extras = "") {
		queueMicrotask(() => {
			console.log(`<${this.localName}> (#${this.instanceId})${message}`, extras)
		});
	}
}
