import html from './shopTitle.html';
import './shopTitle.scss';

export default function (selector, data = {}) {
	$(selector).replaceWith(template.render(html, data));
}
