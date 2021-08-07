import './todoFoot.scss';
import html from './todoFoot.html';

export default function (selector, data = {}) {
	$(selector).replaceWith(template.render(html, data));
}
