{ pkgs }: {
	deps = [
  pkgs.unzip
  pkgs.unzip
  pkgs.nodePackages.prettier
		pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.nodePackages.yarn
        pkgs.replitPackages.jest
	];
}