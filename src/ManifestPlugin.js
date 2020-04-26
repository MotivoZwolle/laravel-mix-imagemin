const multimatch = require('multimatch');

class ManifestPlugin {
    constructor(patterns = []) {
        this.patterns = patterns.map(pattern => {
            if (pattern.to) {
                let toPath = pattern.to;

                // ensure trailing slash
                if (toPath.substr(-1) !== '/') {
                    toPath += '/';
                }

                return `${toPath}${pattern.from}`;
            }
            
            return pattern.from || pattern;
        });
    }

    apply(compiler) {
        const onAfterEmit = (compilation, callback) => {
            const manifest = Mix.manifest.manifest;

            Object.keys(compilation.assets).forEach(asset => {
                if (! manifest[asset] && multimatch(asset, this.patterns).length) {
                    Mix.manifest.add(asset);
                }
            });

            callback();
        };

        compiler.hooks.afterEmit.tapAsync(this.constructor.name, onAfterEmit);
    }
}

module.exports = ManifestPlugin;
