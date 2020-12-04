'use strict';
/* =================================== variables
============================================= */
const price_pool_button = document.querySelector("#price_pool_button");
const pool_container = document.querySelector('#pool_container');
const pool_modal = document.querySelector('#pool_modal');
const close_modal_button = document.querySelector("#close_modal_button");
const e = React.createElement;
const left_block = document.querySelector('#left_block');
const color = {
	fill: '#abaeb1',
	stroke: '#191919',
	curtain: '#d7c797',
	text: '#FFFFFF',
	alert: '#ff0000',
	main: '#e5e5e5',
	back: '#edf1f2',
}


/* =========================== drawing functions
============================================= */

let Window = function (selector, c, col) {
	this.color = {};
	for (let key in c) {
		this.color[key] = c[key];
	}
	this.color.light = '#d3d3d3';
	this.elem = document.querySelector(selector);
	this.w = this.elem.offsetWidth - 30;
	this.h = this.elem.offsetHeight;
	if (this.w < 1 || this.h < 1) {
		if (screen.width < 480) {
			this.w = screen.width - 30;this.h = screen.height/3;
		} else {
			this.w = 480; this.h = 240;
		}
	}
	this.id = '#' + selector.slice(1) + '_svg';
	this.draw = SVG().addTo(selector).size(this.w, this.h).id(this.id);
	if (typeof col == "undefined") {
		if (this.w > this.h) {
			if (this.h == 0) {
				this.elem.style = "height: 160px;";
				this.h = 160;
			}
			this.col = Math.floor(this.w / this.h);
			this.iw = (this.w - 30) / this.col;
		} else {
			this.col = 1;
			this.iw = this.w - 30;
		}
	} else {
		this.col = col;
	}
	this.win_rects = [];
	this.curtains = [];
	this.pattern = this.draw.pattern(20, 11, (add) => {
		add.line(3,5,17,5).stroke({width: 2, color: this.color.curtain});
		add.line(0,10,7,10).stroke({width: 2, color: this.color.curtain});
		add.line(13,10,20,10).stroke({width: 2, color: this.color.curtain});
	}); 
	for (let i = 0; i < this.col; i++) {
		let wi_1 = this.draw.rect(this.iw, this.h - 20).move(15 + i * this.iw, 10).fill(this.color.fill).stroke({
			width: 1,
			color: this.color.stroke,
		}).radius(0, 0);
		let wi_2 = this.draw.rect(this.iw - 20, this.h - 55).move(25 + i * this.iw, 20).fill(this.color.back).stroke({ width: 1, color: this.color.stroke, }).radius(0, 0);
		let rx = 27 + i * this.iw +  Math.random() * (this.iw/3),
			ry = 22 + Math.random() * (this.h / 10),
			rx2 = (i + 1) * this.iw - Math.random() * (this.iw/4),
			ry2 = this.h - 57 + Math.random() * 10;
		this.draw.path(`M ${rx} ${ry} l ${this.iw/4} ${this.iw/4}`).stroke({ width: 5, color: '#ffffff',});
		this.draw.path(`M ${rx + this.iw/5} ${ry} l ${this.iw/4} ${this.iw/4}`).stroke({ width: 5, color: '#ffffff',});
		this.draw.path(`M ${rx2} ${ry2} l -${this.iw/4} -${this.iw/4}`).stroke({ width: 5, color: '#ffffff',});
		let wi_b = this.draw.rect(this.iw - 20, this.h - 55).move(25 + i * this.iw, 20).fill(this.color.fill).stroke({width: 1, color: this.color.stroke});
		this.win_rects.push(wi_b);
		let curtain = this.draw.rect(this.iw - 20, this.h - 75).fill(this.color.curtain).stroke({width: 1, color: this.color.stroke});
		curtain.fill(this.pattern);
		let curt_mask = this.draw.rect(this.iw - 20, this.h).move(25 + i * this.iw, 20).fill('#fff');
		let curt_handle = this.draw.line(curtain.width()/2 + curtain.x() + 5, curtain.height() + curtain.y(), 
			curtain.width()/2 + curtain.x() + 5, curtain.height() + curtain.y() + 20).stroke({width: 3, color: this.color.stroke}); 
		let curt_circle = this.draw.circle(10).move(curtain.width()/2 + curtain.x(), curtain.height() + curtain.y() + 20).fill(this.color.fill)
			.stroke({width: 3, color: this.color.stroke}); 
		this.curtains[i] = this.draw.group();
		this.curtains[i].add(curtain).add(curt_circle).add(curt_handle);
		this.curtains[i].move(25 + i * this.iw, 20);
		this.curtains[i].maskWith(curt_mask);
		this.curtains[i].css('cursor', 'pointer');
		this.curtains[i].click(() => {
			let yi = [];
			if (this.curtains[i].y() > -50) {yi = [50 - this.h, 30];}
			else {yi = [this.h - 50, -30];}
			this.curtains[i].animate(300, 0, 'now').dmove(0, yi[0]);
			this.curtains[i].animate(500, 350, 'now').dmove(0, yi[1]);
		});
		}
	let sill_1 = this.draw.rect(this.w, 10).move(0, 1).fill(this.color.fill).stroke({ width: 1, color: this.color.stroke, }).radius(2, 2);
	let sill_2 = this.draw.rect(this.w, 10).move(0, this.h - 11).fill(this.color.fill).stroke({
		width: 1,
		color: this.color.stroke,
	}).radius(2, 2);
	let sill = this.draw.path(`M 15 ${this.h - 25} L ${this.w - 15} ${this.h - 25} l 15 15 l -${this.w} 0 Z`).fill(this.color.light).stroke({
		width: 1,
		color: this.color.stroke,
	});
	this.curtains.forEach( (c) => {c.front();});
	this.cross_masks = [];
	this.crossbar = (num) => {
		this.cross_masks.forEach( (r) => {r.remove();});
		this.win_rects.forEach( (r) => {
			if (num.length == 0) { r.hide();} else {r.show();}
			let cross_rects = [];
			let he = (this.h - 60) / 2, wi = 10;
			let cy = r.y() + he, cx = r.x() + (this.iw/2);
			num.forEach ( (n) => {
				let ang = 0;
				if (n == 1) {ang = 90;};
				if (n == 2) {ang = 180;};
				if (n == 3) {ang = 270;};
				let rr = this.draw.rect(he + 150, wi).move(cx - wi/2, cy).transform({
					origin: 'center left',
					rotate: ang,
				}).fill('#fff');
				cross_rects.push(rr);
			});
			let mask = this.draw.mask();
			cross_rects.forEach ( (rr) => {
				mask.add(rr);
			});
			r.maskWith(mask);
			this.cross_masks.push(mask);
		});
	}
	this.crossbar([]);
	if (this.curtains.length > 1) {this.curtains[0].dmove(0, 80 - this.h);}
}

let win_2 = new Window ('#drawing_block', color);
let win_1 = new Window ('#left_block', color);
win_1.crossbar([1, 3]);

let center = (selector) => {
	let elem = document.querySelector(selector),
		h = screen.height,
		w = screen.width;
	let he = elem.offsetHeight;
	if (he > h) return;
	let parent = elem.parentElement;
	let wrapper = document.createElement('div');
	let cb = document.createElement('div');
	let body = document.querySelector('body');
	wrapper.classList.add('center_wrapper');
	cb.classList.add('center_block');
	body.appendChild(wrapper);
	wrapper.appendChild(cb);
	cb.appendChild(elem);
	elem.classList.add("pt-4");
}

center ('.hero');
class pool extends React.Component {
	constructor(props) {
		super(props);
		this.state = {answer: 0, price: 0, space_size: 10, length_g: 3, height_g: 1.5, type: 0, manufacturer: 0, gift: false};
		this.coef = 1;
		this.space_size = 0;
		this.answers = ['Выберите конструкцию', 'Выберите площадь', 'Выберите производителя', 'Внимание! Акция!'];
		this.type_names = [ 
		 'Т-образная конструкция',
		 'Горизонтальная балка',
		 'Вертикальная балка',
		 'Крестообразная конструкция',
		 'Две форточки',
		];
		this.manufacturer_names = [
			'Alea Manufacturer',
			'Dimension International',
			'Aim Products Sydney',
			'Decade Brothers Studio',
			'Uryupinsk Issue',
		];
		this.work_coef = 80;
		this.manufacturer_prices = [109, 154, 178, 320, 12];
		this.check = 0;
		this.drawin = (event) => {
			let idd = event.target.id;
			if (idd == 1) {win_2.crossbar([0, 2]);}
			if (idd == 2) {win_2.crossbar([1, 3]);}
			if (idd == 0) {win_2.crossbar([0, 1, 2]);}
			if (idd == 3) {win_2.crossbar([0, 1, 2, 3]);}
			if (idd == 4) {win_2.crossbar([0, 3, 2]);}
			this.setState((state, props) => {
				return {
		  			type: Number.parseInt(idd),
				}}
			);
		};
		this.resize = (event) => {
			if (event.target.id == "length_range") {
				this.setState((state, props) => {
					return {
			  			length_g:  Number.parseInt(event.target.value),	
			  			space_size: this.state.length_g * this.state.height_g,
					}}
				);
			}
			if (event.target.id == "height_range") {
				this.setState((state, props) => {
					return {
			  			height_g:  Number.parseInt(event.target.value),	
			  			space_size: this.state.length_g * this.state.height_g,
					}}
				);
			}
		}
		this.manufacturer_input = (event) => {
			let gift_c = localStorage.getItem('gift');
			if (!gift_c) {gift_c = false;} else {gift_c = true;}
			this.setState((state, props) => {
				return {
					manufacturer: Number.parseInt(event.target.id),
					gift: gift_c,
				}
			});
		}
		this.getResult = (event) => {
			let md = document.querySelector('#pool_modal');
			md.classList.toggle('is_open');
			localStorage.setItem('gift', 0);
			this.setState((state, props) => {
				return {
					answer: 0,
					gift: true,
				}
			});
		}
	}
	render() {
		let hea = React.createElement('div', {className: 'modal-header'}, 
			React.createElement('h4', {className: 'modal-title'}, this.answers[this.state.answer]));
		let dr_but = this.state.answer == 0 ? [
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 0, onClick: this.drawin}, 'Т-образная конструкция'),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 1, onClick: this.drawin}, 'Горизонтальная балка'),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 2, onClick: this.drawin}, 'Вертикальная балка'),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 3, onClick: this.drawin}, 'Крестообразная конструкция'),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 4, onClick: this.drawin}, 'Две форточки'),
		] : ['', '', '', '', '', ];
		let dr_but_main = this.state.answer == 0 ? React.createElement("button",{'className': 'btn btn-success btn-block', 'onClick': () => {
				this.setState((state, props) => {
					return {
  						answer: this.state.answer + 1,
					}
				});
			}}, 'Выбрать: ' + this.type_names[this.state.type]) : null;
		let si_but = this.state.answer == 1 ? [
			React.createElement('label', {className: "range_label"}, 'Общая длина: ' + this.state.length_g  + '.'),
			React.createElement('input', {className: "custom-range", type: "range", id: "length_range", step: 0.5, max: 20, min: 1, onChange: this.resize}, null),
			React.createElement('label', {className: "range_label"}, 'Высота : ' + this.state.height_g + '.'),
			React.createElement('input', {className: "custom-range", type: "range", id: "height_range", step: 0.5, max: 4, min: 0.5, onChange: this.resize}, null),
		] : [null, null, null, null, null, null, null, ];
		let si_but_main = this.state.answer == 1 ? React.createElement("button",{'className': 'btn btn-success btn-block', 'onClick': () => {
				this.setState((state, props) => {
					return {
  						answer: this.state.answer + 1,
					}
				});
			}}, 'Выбрать: ' + this.state.space_size + 'кв.м') : null;
		let ma_but = this.state.answer == 2 ? [
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 0, onClick: this.manufacturer_input}, this.manufacturer_names[0]),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 1, onClick: this.manufacturer_input}, this.manufacturer_names[1]),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 2, onClick: this.manufacturer_input}, this.manufacturer_names[2]),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 3, onClick: this.manufacturer_input}, this.manufacturer_names[3]),
			React.createElement('button', {className: 'btn btn-primary btn-block', id: 4, onClick: this.manufacturer_input}, this.manufacturer_names[4]),
		] : [null, null, null, null, null, null, null, null, ];
		let ma_but_main = this.state.answer == 2 ? React.createElement("button",{'className': 'btn btn-success btn-block', 'onClick': () => {
				let coef = [10, 12.2, 16.2, 7.5, 9.5, 5.7][this.state.type];
				let price_c = coef * this.state.space_size * this.manufacturer_prices[this.state.manufacturer];
				this.setState((state, props) => {
					return {
						price: price_c,
  						answer: this.state.answer + 1,
					}
				});
		}}, 'Выбрать: ' + this.manufacturer_names[this.state.manufacturer]) : null;
		let result = this.state.answer == 3 ? React.createElement('div', {className: 'result'}, 
			React.createElement('p', null, 'Стоимость материалов: ' + this.state.price + ' рублей.'),
			React.createElement('p', null, 'Стоимость установки: ' + (this.state.space_size * this.work_coef) + ' рублей.'),
			React.createElement('p', {className: "alert_action"}, (this.state.gift ? 'При заказке от 20 тыс. — установка бесплатно.' 
				: 'Установим бесплатно, если закажете прямо сейчас. Предложение уникально.')))
			: null;
		let result_button = this.state.answer == 3 && !this.state.gift ? React.createElement('button', {className: "btn btn-success btn-block", onClick: this.getResult}, 'Забрать подарок' ) : null;
		return (
				React.createElement("div", {className: 'modal-body'},
					hea, dr_but[0],  dr_but[1],  dr_but[2],  dr_but[3],  dr_but[4], dr_but_main, 
					si_but[0], si_but[1], si_but[2], si_but[3], si_but_main,
					ma_but[0], ma_but[1], ma_but[2], ma_but[3], ma_but[4], ma_but_main,
					result, result_button,
				)
			);
	}
}
ReactDOM.render(e(pool), pool_container);
/* ============================== eventListeners
============================================= */

price_pool_button.addEventListener('click', () => {
	pool_modal.classList.toggle('is_open');
})
close_modal_button.addEventListener('click', (event) => {
	pool_modal.classList.toggle('is_open');
})
pool_modal.addEventListener('click', (event) => {
	if (event.target.id != "pool_modal") return;
	if (event.target.parentElement.parentElement.id == "close_modal_button") return;
	pool_modal.classList.toggle('is_open');
})
