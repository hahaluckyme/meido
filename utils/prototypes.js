Array.prototype.sortBy = function(func) { return this.sort((a, b) => func(a) - func(b)); }
