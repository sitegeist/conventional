const path = require('path');

class ImportPathResolver {

    constructor () {
        this.importFilePath = '';
        this.entryDirName = '';
        this.filePath = '';
        this.initialPreviousResolvedPath = '';
        this.nextPreviousResolvedPath = '';
    }

    get resolvedFilePath() {

        this.filePath = path.join(path.dirname(this.initialPreviousResolvedPath), this.importFilePath);

        if(!path.isAbsolute(this.filePath)) {
            if (this.nextPreviousResolvedPath === '') {
                this.nextPreviousResolvedPath = this.initialPreviousResolvedPath;
                return path.join(this.entryDirName, this.filePath);
            } else {
                return path.join(this.entryDirName, path.join(path.dirname(this.nextPreviousResolvedPath), this.importFilePath));
            }

        } else {
            this.nextPreviousResolvedPath = '';
            if(this.entryDirName === '') {
                this.entryDirName = path.dirname(this.initialPreviousResolvedPath)
            }
        }

        return this.filePath;

    }

}

module.exports = {
    ImportPathResolver
};
