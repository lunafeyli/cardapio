import domtoimage from "dom-to-image";
import { useRef, useState } from "react";
import "./App.css";
import { Logo } from "./components/Logo";
import { Product } from "./components/Product";
import { Waves } from "./components/Waves";
import { useLocalStorage } from "./useLocalStorage";

type Product = {
	name: string;
	description: string;
	price: number;
	img: string;
};

function App() {
	const [modal, setModal] = useState(false);
	const [theme, setTheme] = useState("red");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [products, setProducts] = useLocalStorage<Product[]>("product", []);
	const imgInputRef = useRef<HTMLInputElement>(null);

	function newProductHanlder() {
		function readURL(files?: FileList | null) {
			if (files && files[0]) {
				let reader = new FileReader();

				reader.onload = function (e) {
					const product = {
						name,
						description,
						price,
						img: String(e.target?.result) || "",
					};

					setProducts([...products, product]);

					setModal((value) => !value);
				};

				reader.readAsDataURL(files[0]);
			}
		}

		readURL(imgInputRef.current?.files);
	}

	function removeProductHanlder(productToRemove: Product) {
		const newProducts = products.filter(
			(product) =>
				product.name + product.description !==
				productToRemove.name + productToRemove.description
		);

		setProducts(newProducts);
	}

	const date = new Date();

	function downloadCanvas(canvas: HTMLCanvasElement) {
		// get canvas data
		var image = canvas.toDataURL();

		// create temporary link
		var tmpLink = document.createElement("a");
		tmpLink.download = `cardapio-${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`; // set the name of the download file
		tmpLink.href = image;

		// temporarily add link to body and initiate the download
		document.body.appendChild(tmpLink);
		tmpLink.click();
		document.body.removeChild(tmpLink);
	}

	const handleDownload = () => {
		// html2canvas(document.getElementById("content"), {
		// 	allowTaint: true,
		// 	useCORS: true,
		// 	width: 320,
		// 	height: document.getElementById("content")?.clientHeight,
		// }).then((canvas: HTMLCanvasElement) => {
		// 	document.body.appendChild(canvas);
		// 	// downloadCanvas(canvas);
		// });
		domtoimage
			.toPng(document.getElementById("content"), {
				height: document.getElementById("content")?.clientHeight,
				width: 320,
			})
			.then((dataUrl: string) => {
				var link = document.createElement("a");
				link.download = `cardapio-${date.getDate()}_${date.getMonth()}_${date.getFullYear()}.png`;
				link.href = dataUrl;
				link.click();
			});
	};

	return (
		<>
			<div className={`App ${theme}`}>
				{modal && (
					<div
						className="modal-overlay"
						onClick={(e) => {
							if (e.target.className === "modal-overlay")
								setModal((value) => !value);
						}}
					>
						<div className="modal">
							<input
								type="text"
								placeholder="Nome"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
							<input
								type="text"
								placeholder="Descrição"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
							<input
								type="number"
								placeholder="Preço"
								min={0}
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
							/>
							<input type="file" ref={imgInputRef} />
							<div className="buttons">
								<button
									onClick={() => setModal((value) => !value)}
								>
									Cancelar
								</button>
								<button onClick={newProductHanlder}>
									Salvar
								</button>
							</div>
						</div>
					</div>
				)}
				<button
					className="modal-btn"
					onClick={() => setModal((value) => !value)}
				>
					+
				</button>
				<button className="save-btn" onClick={() => handleDownload()}>
					Bx
				</button>
				<select
					name="theme"
					id="theme"
					onChange={(e) => setTheme(e.target.value)}
					value={theme}
				>
					<option value="red">Vermelho</option>
					<option value="orange">Laranja</option>
					<option value="pink">Rosa</option>
					<option value="brown">Marrom</option>
				</select>
				<div className="content" id="content">
					<header>
						<Logo />
					</header>
					<Waves colors={["D71219", "6c090d"]} />
					<div className="products">
						{products.map((product, index) => (
							<Product
								product={product}
								imgLeft={index % 2 !== 0}
								key={product.name}
								deleteFunc={removeProductHanlder}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
