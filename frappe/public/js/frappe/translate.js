// Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
// MIT License. See license.txt

// for translation
frappe._ = function (txt, replace, context = null) {
	if (!txt) return txt;
	if (typeof txt != "string") return txt;

	let translated_text = "";

	let key = txt; // txt.replace(/\n/g, "");
	if (context) {
		translated_text = frappe._messages[`${key}:${context}`];
	}

	if (!translated_text) {
		translated_text = frappe._messages[key] || txt;
	}

	if (replace && typeof replace === "object") {
		translated_text = $.format(translated_text, replace);
	}
	return translated_text;
};

frappe.__ = function (txt, replace, context = null) {
	const isHTML = /<[a-z][\s\S]*>/i.test(txt);
	if (isHTML) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(txt, "text/html");
		replaceTextNodes(doc.body);

		function replaceTextNodes(node) {
			if (node.nodeType === Node.TEXT_NODE) {
				node.textContent = frappe._(node.textContent, replace, context);
			} else {
				node.childNodes.forEach((child) => {
					replaceTextNodes(child);
				});
			}
		}

		return doc.body.innerHTML;
	} else {
		return frappe._(txt, replace, context);
	}
};

window.__ = frappe._;
window.___ = frappe.__;

frappe.get_languages = function () {
	if (!frappe.languages) {
		frappe.languages = [];
		$.each(frappe.boot.lang_dict, function (lang, value) {
			frappe.languages.push({ label: lang, value: value });
		});
		frappe.languages = frappe.languages.sort(function (a, b) {
			return a.value < b.value ? -1 : 1;
		});
	}
	return frappe.languages;
};
