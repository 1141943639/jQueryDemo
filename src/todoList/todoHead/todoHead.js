import './todoHead.scss';
import html from './todoHead.html';

export default function (selector, data) {
	$(selector).replaceWith(template.render(html, data));
}
