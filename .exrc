" Zapilates - Neovim project configuration
" All shortcuts under <leader>p prefix

" Hugo server
nnoremap <leader>ps :!preview<CR>

" Hugo build
nnoremap <leader>pb :!hugo --minify<CR>

" Open docs server
nnoremap <leader>pd :!cd docs && mkdocs serve<CR>


" Format all files
nnoremap <leader>pf :!pre-commit run --all-files<CR>

" Git status
nnoremap <leader>pg :!git status<CR>
