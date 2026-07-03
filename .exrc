" Canto Lyrico - Neovim project configuration
" All shortcuts under <leader>p prefix

" Hugo server
nnoremap <leader>ps :!hugo server -D<CR>

" Hugo build
nnoremap <leader>pb :!hugo --minify<CR>

" Open docs server
nnoremap <leader>pd :!cd docs && mkdocs serve<CR>

" Run migration script
nnoremap <leader>pm :!python scripts/migrate.py<CR>

" Format all files
nnoremap <leader>pf :!pre-commit run --all-files<CR>

" Git status
nnoremap <leader>pg :!git status<CR>
