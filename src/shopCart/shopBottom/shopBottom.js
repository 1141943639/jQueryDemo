import html from './shopBottom.html';
import './shopBottom.scss';

export default function (selector, cartList) {
	$(selector).replaceWith(template.render(html));
}
