-- Canto Lyrico - Neovim project configuration
-- Requires which-key.nvim for organized keybindings

local ok, wk = pcall(require, "which-key")
if not ok then
  return
end

wk.register({
  p = {
    name = "Project",
    s = { "<cmd>!preview<cr>", "Live preview (hot reload)" },
    b = { "<cmd>!hugo --minify<cr>", "Build site" },
    d = { "<cmd>!cd docs && mkdocs serve &<cr>", "Start docs server" },
    f = { "<cmd>!pre-commit run --all-files<cr>", "Format all" },
    g = { "<cmd>!git status<cr>", "Git status" },
    c = { "<cmd>!pre-commit run<cr>", "Pre-commit check" },
    n = { "<cmd>e content/<cr>", "Browse content" },
    t = { "<cmd>e themes/zapilates-studio/<cr>", "Browse theme" },
  },
}, { prefix = "<leader>" })

-- File type associations
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
  pattern = { "*.md" },
  callback = function()
    vim.opt_local.wrap = true
    vim.opt_local.linebreak = true
    vim.opt_local.spell = true
    vim.opt_local.spelllang = "en"
  end,
})

-- Hugo templates
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
  pattern = { "*.html" },
  callback = function()
    local path = vim.fn.expand("%:p")
    if path:match("themes/") or path:match("layouts/") then
      vim.opt_local.filetype = "gohtmltmpl"
    end
  end,
})

-- SCSS
vim.api.nvim_create_autocmd({ "BufRead", "BufNewFile" }, {
  pattern = { "*.scss" },
  callback = function()
    vim.opt_local.shiftwidth = 2
    vim.opt_local.tabstop = 2
    vim.opt_local.expandtab = true
  end,
})
