class SharedBaseElement extends HTMLElement {
	shadowRoot = this.attachShadow({ mode: "open" });

	constructor() {
		super();

		if (this.constructor.template) {
			this.shadowRoot.appendChild(
				this.constructor.template.content.cloneNode(true)
			);
		}
		if (this.constructor.styleSheet) {
			this.shadowRoot.adoptedStyleSheets = [this.constructor.styleSheet];
		}

		this.addEventListener("click", this);
	}

	handleEvent() {
		console.log("Override this");
	}

	static define() {
		if (!window.customElements.get(this.tagName)) {
			window[this.name] = this;
			window.customElements.define(this.tagName, this);
		}
	}
}

export class MoveItElement extends SharedBaseElement {
	static tagName = "move-it";

	static template = document.createElement("template");
	static styleSheet = new CSSStyleSheet();
	static {
		this.template.innerHTML = `<button type="button">Move First To End</button>`;
	}

	handleEvent() {
		const el = this.ownerDocument.querySelector(":is(section:first-of-type custom-element-lifecycle:first-of-type)");
		el.parentElement.appendChild(el);
	}
}

export class SetupFormsElement extends SharedBaseElement {
	static tagName = "setup-forms";
	static template = document.createElement("template");
	static {
		this.template.innerHTML = `<button type="button">Setup Forms</button>`;
	}

	handleEvent() {
		const formsTemplate = this.querySelector(":scope > template");
		this.replaceWith(formsTemplate.content.cloneNode(true));
	}
}

export class MoveBetweenFormsElement extends SharedBaseElement {
	static tagName = "move-between-forms";
	static template = document.createElement("template");
	static {
		this.template.innerHTML = `<button type="button">Change Form Association</button>`;
	}

	handleEvent() {
		const el = document.querySelector("custom-element-lifecycle[form]");
		const currentForm = el.getAttribute("form");
		el.setAttribute("form", currentForm === "first" ? "second" : "first");
	}
}

export class DisableFormsElement extends SharedBaseElement {
	static tagName = "disable-forms";
	static template = document.createElement("template");
	static styleSheet = new CSSStyleSheet();
	static {
		this.template.innerHTML = `<button type="button" aria-pressed="false">Toggle Disabled</button>`;
		this.styleSheet.replaceSync(`
	button[aria-pressed="true"] {
		color-scheme: dark;
	}
@media (prefers-color-scheme: dark) {
	button[aria-pressed="true"] {
		color-scheme: light;
	}
}
		`);
	}

	get toggleButton() {
		return this.shadowRoot.querySelector("button");
	}

	handleEvent() {
		this.ownerDocument.querySelector("custom-element-lifecycle[form]").toggleAttribute("disabled");

		this.toggleButton.setAttribute("aria-pressed", this.toggleButton.getAttribute("aria-pressed") === "true" ? "false" : "true");
	}
}
