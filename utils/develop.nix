{
  inputs,
  system,
  pkgs,
  ...
}:
pkgs.mkShell {
  packages = [
    # Version control & visualization
    pkgs.git
    pkgs.gource
    pkgs.ffmpeg

    # TUI/CLI tools
    pkgs.gum
    pkgs.chafa

    # Hugo static site generator
    pkgs.hugo
    pkgs.dart-sass
    pkgs.nodejs_22

    # Documentation
    pkgs.python312Packages.mkdocs
    pkgs.python312Packages.mkdocs-material

    # Code quality & linting
    pkgs.pre-commit
    pkgs.nixfmt-rfc-style
    pkgs.bearer
    pkgs.shfmt
    pkgs.markdownlint-cli
    pkgs.actionlint
    pkgs.shellcheck
    pkgs.nodePackages.cspell

    # Presentations & local server
    pkgs.marp-cli
    pkgs.httplz

  ];

  shellHook = ''
    # Make the repo's helper scripts (e.g. `preview`) available on PATH.
    export PATH="$PWD/scripts:$PATH"
    # Run the welcome prompt
    ./utils/prompt.sh
  '';
}
