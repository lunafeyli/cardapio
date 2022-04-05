import domtoimage from "dom-to-image";
import React, { useRef, useState } from "react";
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
	const [newModal, setNewModal] = useState(false);
	const [editModal, setEditModal] = useState(false);
	const [editingProductId, setEditingProductId] = useState<number | null>(
		null
	);
	const [theme, setTheme] = useState("red");
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [products, setProducts] = useLocalStorage<Product[]>("product", []);
	const [title, setTitle] = useState("");
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

					setNewModal((value) => !value);
					setName("");
					setDescription("");
					setPrice(0);
				};

				reader.readAsDataURL(files[0]);
			}
		}

		readURL(imgInputRef.current?.files);
	}

	function editProductHandler() {
		if (editingProductId === null) return;

		const newProducts = [...products];

		let editingProduct = products[editingProductId];

		editingProduct = {
			name,
			description,
			price,
			img: editingProduct.img,
		};

		newProducts[editingProductId] = editingProduct;

		setProducts(newProducts);

		setEditModal((value) => !value);
		setName("");
		setDescription("");
		setPrice(0);
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

	const handleDownload = () => {
		const filter = (node: any) => {
			if (node.tagName === "DIV" || node.tagName === "BUTTON")
				return !node.className.includes("only-html");

			return true;
		};

		domtoimage
			.toPng(document.getElementById("content"), {
				height: document.getElementById("content")?.clientHeight,
				width: 320,
				filter,
			})
			.then((dataUrl: string) => {
				var link = document.createElement("a");
				link.download = `cardapio-${date.getDate()}_${date.getMonth()}_${date.getFullYear()}.png`;
				link.href = dataUrl;
				link.click();
			});
	};

	function reorderHanlder(index: number, dir: "up" | "down") {
		let newProducts = [...products];

		const reorder = {
			up() {
				if (!newProducts[index - 1]) return;

				let item = newProducts[index - 1];
				newProducts[index - 1] = newProducts[index];
				newProducts[index] = item;
			},
			down() {
				if (!newProducts[index + 1]) return;

				let item = newProducts[index + 1];
				newProducts[index + 1] = newProducts[index];
				newProducts[index] = item;
			},
		};

		reorder[dir]();

		setProducts(newProducts);
	}

	function editHandler(index: number) {
		setEditingProductId(index);
		setName(products[index].name);
		setDescription(products[index].description);
		setPrice(products[index].price);
		setEditModal((value) => !value);
	}

	return (
		<>
			<div className={`App ${theme}`}>
				{newModal && (
					<div
						className="modal-overlay"
						onClick={(e: React.MouseEvent<HTMLDivElement>) => {
							const { className } = e.target as HTMLDivElement;
							if (className === "modal-overlay")
								setNewModal((value) => !value);
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
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
							/>
							<input type="file" ref={imgInputRef} />
							<div className="buttons">
								<button
									onClick={() => {
										setNewModal((value) => !value);
										setName("");
										setDescription("");
										setPrice(0);
									}}
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
				{editModal && (
					<div
						className="modal-overlay"
						onClick={(e: React.MouseEvent<HTMLDivElement>) => {
							const { className } = e.target as HTMLDivElement;
							if (className === "modal-overlay")
								setEditModal((value) => !value);
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
								value={price}
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
							/>
							<div className="buttons">
								<button
									onClick={() => {
										setEditingProductId(null);
										setEditModal((value) => !value);
										setName("");
										setDescription("");
										setPrice(0);
									}}
								>
									Cancelar
								</button>
								<button onClick={editProductHandler}>
									Salvar
								</button>
							</div>
						</div>
					</div>
				)}
				<button
					className="modal-btn"
					onClick={() => setNewModal((value) => !value)}
				>
					+
				</button>
				<input
					type="text"
					id="title-input"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
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
						<h1 className="title">{title}</h1>
					</header>
					<Waves colors={["D71219", "6c090d"]} />
					<div
						className="products"
						style={{ paddingTop: title !== "" ? 24 : 0 }}
					>
						{products.map((product, index) => (
							<Product
								product={product}
								imgLeft={index % 2 !== 0}
								key={product.name}
								index={index}
								deleteFunc={removeProductHanlder}
								reorderFunc={reorderHanlder}
								editFunc={editHandler}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
