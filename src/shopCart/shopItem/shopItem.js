import html from './shopItem.html';
import './shopItem.scss';

export default function (selector, data = {}) {
	$(selector).replaceWith(template.render(html, data));
}
