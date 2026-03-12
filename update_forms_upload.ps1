$content = Get-Content -Path "src\pages\Admin.tsx" -Raw

$addFormTargetImage = @'
                                                    <div className="lg:col-span-2 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Main Image URL</label>
                                                        <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                    </div>
                                                    <div className="lg:col-span-1 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Gallery (URLs, comma-separated)</label>
                                                        <textarea rows={1} value={newProduct.gallery?.join(', ')} onChange={e => setNewProduct({ ...newProduct, gallery: e.target.value.split(',').map(t => t.trim()) })} placeholder="URL1, URL2..." className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all resize-none" />
                                                    </div>
'@

$addFormReplacementImage = @'
                                                    <div className="lg:col-span-2 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Main Image URL</label>
                                                        <div className="flex gap-2">
                                                            <input type="text" value={newProduct.image_url} onChange={e => setNewProduct({ ...newProduct, image_url: e.target.value })} placeholder="https://..." className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all" />
                                                            <label className="bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl cursor-pointer hover:bg-neutral-100 transition-all text-neutral-400 hover:text-neutral-900 group relative">
                                                                <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, ''image_url'')} />
                                                                <Camera size={20} />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="lg:col-span-1 space-y-1.5 font-sans">
                                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider ml-1">Gallery Media</label>
                                                        <div className="flex gap-2">
                                                            <textarea rows={1} value={newProduct.gallery?.join('',' ')} onChange={e => setNewProduct({ ...newProduct, gallery: e.target.value.split('','').map(t => t.trim()) })} placeholder="URL1, URL2..." className="flex-1 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-neutral-900 transition-all resize-none" />
                                                            <label className="bg-neutral-50 border border-neutral-200 p-2.5 rounded-xl cursor-pointer hover:bg-neutral-100 transition-all text-neutral-400 hover:text-neutral-900 group relative">
                                                                <input type="file" className="hidden" accept="image/*" multiple onChange={e => handleImageUpload(e, ''gallery'')} />
                                                                <Upload size={20} />
                                                            </label>
                                                        </div>
                                                    </div>
'@

$editFormTargetEnd = @'
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                                                <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 resize-none" />
                                                            </div>
'@

$editFormReplacementEnd = @'
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Image URL</label>
                                                                    <div className="flex gap-2">
                                                                        <input type="text" value={editingProduct.image_url} onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })} className="flex-1 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-medium" />
                                                                        <label className="bg-white border border-neutral-200 p-2 rounded-xl cursor-pointer hover:bg-neutral-50 transition-all text-neutral-400 hover:text-neutral-900 group relative">
                                                                            <input type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, ''image_url'', true)} />
                                                                            <Camera size={16} />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Gallery (comma-separated)</label>
                                                                    <div className="flex gap-2">
                                                                        <input type="text" value={editingProduct.gallery?.join('',' ')} onChange={e => setEditingProduct({ ...editingProduct, gallery: e.target.value.split('','').map(t => t.trim()) })} className="flex-1 bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 font-medium" />
                                                                        <label className="bg-white border border-neutral-200 p-2 rounded-xl cursor-pointer hover:bg-neutral-50 transition-all text-neutral-400 hover:text-neutral-900 group relative">
                                                                            <input type="file" className="hidden" accept="image/*" multiple onChange={e => handleImageUpload(e, ''gallery'', true)} />
                                                                            <Upload size={16} />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Description</label>
                                                                <textarea rows={3} value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 px-3 py-2 rounded-xl text-sm outline-none focus:border-neutral-900 resize-none" />
                                                            </div>
'@

$content = $content.Replace($addFormTargetImage, $addFormReplacementImage)
$content = $content.Replace($editFormTargetEnd, $editFormReplacementEnd)
$content | Set-Content -Path "src\pages\Admin.tsx" -NoNewline
