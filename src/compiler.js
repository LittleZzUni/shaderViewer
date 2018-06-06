import jsbeautifier from 'js-beautify';
import Prism from '../lib/prism.js';
import {
    Compiler
} from '../lib/compiler';

const compiler = {
    preprocess(code, callback, options = {}) {
        const compiler = new Compiler(Object.assign({
            constants: {
                GL_ES: '1'
            }
        }, options));

        compiler.once('error', function(msg) {
            callback && callback(msg, null);
        });

        compiler.once('success', function(result) {
            callback && callback(null, result);
        });

        compiler.compile(code);
    },
    beautify(code){
        code = code.replace(/#([\w]+)\s/g, '$$$1$$ ').replace(/^\s+/g, '');
        code = jsbeautifier(code).replace(/\$([\w]+)\$/g, '#$1').replace(/\n\n+/g, '\n');
        return code;
    },
    hightlight(code){
        code = '\n' + code;

        return Prism.highlight(code, Prism.languages.glsl, 'glsl');
    },
    parse(preCode, callback, options = {}){
        if(preCode){
            this.preprocess(preCode, (error, code) => {
                if(error){
                    code = `//${error}\n` + preCode; 
                }
                else{
                    code = this.beautify(code);
                }
                callback(error, code);                
            }, options);
        }
        else{
            callback(null, '');
        }
    },
    parseHighlight(preCode, callback, options){
        this.parse(preCode, (error, code) => {
            const hightlightCode = this.hightlight(code);
            callback(error, hightlightCode);
        }, options);
    }
};

export default compiler;