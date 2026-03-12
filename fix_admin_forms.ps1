$content = Get-Content -Path "src\pages\Admin.tsx" -Raw

$addFormTarget = @'
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Product Name</label>
                                                        <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Lavender Essential Oil" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Price (PKR)</label>
                                                        <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-mono" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Stock Level</label>
                                                        <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-mono" />
                                                    </div>
                                                    <div className="lg:col-span-2 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Image URL</label>
                                                        <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://source.unsplash.com/..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                    </div>
                                                    <div className="lg:col-span-3 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Description</label>
                                                        <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Brief product description..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all resize-none" />
                                                    </div>
                                                </div>
'@

$addFormReplacement = @'
                                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Product Name</label>
                                                        <input type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Lavender Essential Oil" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Category</label>
                                                        <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-sans">
                                                            {['Skincare', 'Haircare', 'Bodycare', 'Bundle', 'Accessory'].map(cat => <option key={cat}>{cat}</option>)}
                                                        </select>
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Price (PKR)</label>
                                                        <input type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-mono" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">COGS (PKR)</label>
                                                        <input type="number" value={newProduct.cogs ?? 0} onChange={e => setNewProduct({ ...newProduct, cogs: Number(e.target.value) })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-mono" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Stock Level</label>
                                                        <input type="number" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-mono" />
                                                    </div>
                                                    <div className="space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Tags (comma-separated)</label>
                                                        <input type="text" value={newProduct.tags?.join(', ')} onChange={e => setNewProduct({ ...newProduct, tags: e.target.value.split(',').map(t => t.trim()) })} placeholder="organic, skin, pure" className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all font-sans" />
                                                    </div>
                                                    <div className="lg:col-span-2 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Main Image URL</label>
                                                        <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                    </div>
                                                    <div className="lg:col-span-1 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Gallery (URLs, comma-separated)</label>
                                                        <textarea rows={1} value={newProduct.gallery?.join(', ')} onChange={e => setNewProduct({ ...newProduct, gallery: e.target.value.split(',').map(t => t.trim()) })} placeholder="URL1, URL2..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all resize-none" />
                                                    </div>
                                                    <div className="lg:col-span-3 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Description</label>
                                                        <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Brief product description..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all resize-none" />
                                                    </div>
                                                </div>
'@

$editFormTarget = @'
                                                        <div className="p-6 flex flex-col gap-4 flex-1">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label>
                                                                <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-bold" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Price</label>
                                                                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-mono" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Stock</label>
                                                                    <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-mono" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                                                <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 resize-none" />
                                                            </div>
'@

$editFormReplacement = @'
                                                        <div className="p-6 flex flex-col gap-4 flex-1">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Product Name</label>
                                                                <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-bold" />
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Category</label>
                                                                    <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-sans">
                                                                        {['Skincare', 'Haircare', 'Bodycare', 'Bundle', 'Accessory'].map(cat => <option key={cat}>{cat}</option>)}
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">COGS</label>
                                                                    <input type="number" value={editingProduct.cogs ?? 0} onChange={e => setEditingProduct({ ...editingProduct, cogs: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-mono" />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Price</label>
                                                                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-mono" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Stock</label>
                                                                    <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-mono" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                                                <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 resize-none" />
                                                            </div>
'@

$content = $content.Replace($addFormTarget, $addFormReplacement)
$content = $content.Replace($editFormTarget, $editFormReplacement)
$content | Set-Content -Path "src\pages\Admin.tsx" -NoNewline
