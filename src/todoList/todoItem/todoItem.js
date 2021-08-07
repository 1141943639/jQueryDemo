import './todoItem.scss';
import html from './todoItem.html';

export default function (selector, data) {
	$(selector).replaceWith(template.render(html, data));
}
