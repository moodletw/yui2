/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * A RecordSet defines and manages a set of Records.
 *
 * @class RecordSet
 * @param data {Object || Object[]} An object literal or an array of data.
 * @constructor
 */
YAHOO.widget.RecordSet = function(data) {
    // Internal variables
    this._nIndex = YAHOO.widget.RecordSet._nCount;
    this._records = [];
    
    if(data) {
        if(YAHOO.lang.isArray(data)) {
            this.addRecords(data);
        }
        else if(data.constructor == Object) {
            this.addRecord(data);
        }
    }

    /**
     * Fired when a Record is updated with new data.
     *
     * @event recordUpdateEvent
     * @param oArgs.record {YAHOO.widget.Record} The Record instance.
     * @param oArgs.key {String} The Record key.
     * @param oArgs.newData {Object} New data.
     * @param oArgs.oldData {Object} Old data.
     *
     */
    this.createEvent("recordUpdateEvent");
    
    
    YAHOO.widget.RecordSet._nCount++;
    YAHOO.log("RecordSet initialized", "info", this.toString());
};

if(YAHOO.util.EventProvider) {
    YAHOO.augment(YAHOO.widget.RecordSet, YAHOO.util.EventProvider);
}
else {
    YAHOO.log("Missing dependency: YAHOO.util.EventProvider","error",this.toString());
}

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////
/**
 * Internal class variable to index multiple data table instances.
 *
 * @property _nCount
 * @type number
 * @private
 * @static
 */
YAHOO.widget.RecordSet._nCount = 0;

/**
 * Instance index.
 *
 * @property _nIndex
 * @type number
 * @private
 */
YAHOO.widget.RecordSet.prototype._nIndex = null;

/**
 * Internal counter of how many records are in the RecordSet
 *
 * @property _length
 * @private
 */
YAHOO.widget.RecordSet.prototype._length = null;

/////////////////////////////////////////////////////////////////////////////
//
// Private methods
//
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Public accessor to the unique name of the RecordSet instance.
 *
 * @method toString
 * @return {string} Unique name of the RecordSet instance
 */
YAHOO.widget.RecordSet.prototype.toString = function() {
    return "RecordSet instance " + this._nIndex;
};

/**
 * Returns the number of non-null records in the sparse RecordSet
 *
 * @method getLength
 * @return {Number} Number records in the RecordSet
 */
YAHOO.widget.RecordSet.prototype.getLength = function() {
        return this._length;
};

/**
 * Returns record with given name, at the given index, or null.
 *
 * @method getRecord
 * @param identifier {String || Number} Record ID or record index
 * @return {Object} Record object
 */
YAHOO.widget.RecordSet.prototype.getRecord = function(identifier) {
    if(YAHOO.lang.isNumber(identifier)) {
        return this._records[identifier];
    }
    else if(YAHOO.lang.isString(identifier)) {
        for(var i=0; i<this._records.length; i++) {
            if(this._records[i].yuiRecordId == identifier) {
                return this._records[i];
            }
        }
    }
    return null;

};

/**
 * Returns an array of Records from the RecordSet.
 *
 * @method getRecords
 * @param i {number} (optional) Index of which record to start at
 * @param range {number} (optional) Number of records to get
 * @return {Array} Array of records starting at given index and lenth equal to
 * given range. If i is null, entire RecordSet array is returned.
 */
YAHOO.widget.RecordSet.prototype.getRecords = function(i, range) {
    if(!YAHOO.lang.isNumber(i)) {
        return this._records;
    }
    if(!YAHOO.lang.isNumber(range)) {
        return this._records.slice(i);
    }
    return this._records.slice(i, i+range);
};

/**
 * Returns index for the given record.
 *
 * @method getRecordIndex
 * @param oRecord {object} Record object
 * @return {number} index
 */

/*YAHOO.widget.RecordSet.prototype.getRecordIndex = function(oRecord) {
    //TODO: return i;
};*/

/**
 * Returns the record(2) with the given value at the given key.
 *
 * @method getRecordBy
 * @param sKey {String} Key to search.
 * @param oValue {Object} to match against.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} Record or array of
 * Records with the given value at the given key, or null.
 */
/*YAHOO.widget.RecordSet.prototype.getRecordBy = function(sKey, oValue) {
     TODO: redo to match new algorithm
    var record = null;
    var length = this._records.length;
    for(var i=length-1; i>0; i--) {
        record = this._records[i];
        if(record && (record.extid == extId)) {
            return record;
        }
    }
    return null;

};*/

/**
 * Updates given Record at given key with given data.
 *
 * @method updateRecord
 * @param oRecord {YAHOO.widget.Record} A Record instance.
 * @param sKey {String} Key.
 * @param oData {Object) New data.
 */
YAHOO.widget.RecordSet.prototype.updateRecord = function(oRecord, sKey, oData) {
    var oldData = oRecord[sKey];
    oRecord[sKey] = oData;
    this.fireEvent("recordUpdateEvent",{record:oRecord,key:sKey,newData:oData,oldData:oldData});
};

/**
 * Adds one Record to the RecordSet at the given index. If index is null,
 * then adds the Record to the end of the RecordSet.
 *
 * @method addRecord
 * @param oObjectLiteral {Object} An object literal of data.
 * @param index {Number} (optional) Position index.
 * @return {YAHOO.widget.Record} A Record instance.
 */
YAHOO.widget.RecordSet.prototype.addRecord = function(oObjectLiteral, index) {
    if(oObjectLiteral && (oObjectLiteral.constructor == Object)) {
        var oRecord = new YAHOO.widget.Record(oObjectLiteral);
        if(YAHOO.lang.isNumber(index) && (index > -1)) {
            this._records.splice(index,0,oRecord);
        }
        else {
            this._records.push(oRecord);
        }
        this._length++;
        return oRecord;
    }
    else {
        return null;
    }
};

/**
 * Adds multiple Records to the RecordSet at the given index. If index is null,
 * then adds the Records to the end of the RecordSet.
 *
 * @method addRecords
 * @param data {Object[]} An array of object literal data.
 * @param index {Number} (optional) Position index.
 * @return {YAHOO.widget.Record} An array of Record instances.
 */
YAHOO.widget.RecordSet.prototype.addRecords = function(data, index) {
    if(YAHOO.lang.isArray(data)) {
        var newRecords = [];
        // Can't go backwards bc we need to preserve order
        for(var i=0; i<data.length; i++) {
            var record = this.addRecord(data[i], index);
            newRecords.push(record);
       }
       return newRecords;
    }
    else if(data && (data.constructor == Object)) {
        return this.addRecord(data);
    }
    else {
        return null;
    }
};

/**
 * Convenience method to append the given data to the end of the RecordSet.
 *
 * @method append
 * @param data {Object || Object[]} An object literal or array of data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record or array of Records.
 */
YAHOO.widget.RecordSet.prototype.append = function(data) {
    if(YAHOO.lang.isArray(data)) {
        var newRecords = [];
        // Cant't go backwards bc we need to preserve order
        for(var i=0; i<data.length; i++) {
            var record = this.addRecord(data[i]);
            newRecords.push(record);
            
       }
       YAHOO.log("RecordSet appended with " + newRecords.length + " Record(s)","info",this.toString());
       return newRecords;
    }
    else if(data && (data.constructor == Object)) {
        YAHOO.log("RecordSet appended with 1 Record","info",this.toString());
        return this.addRecord(data);
    }
    else {
        return null;
    }
    
};

/**
 * Convenience method to insert the given data into the beginning of the RecordSet.
 *
 * @method insert
 * @param data {Object || Object[]} An object literal or array of data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record or array of Records.
 */
YAHOO.widget.RecordSet.prototype.insert = function(data) {
    if(YAHOO.lang.isArray(data)) {
        var newRecords = [];
        // Can't go backwards bc we need to preserve order
        for(var i=data.length-1; i>-1; i--) {
            var record = this.addRecord(data[i], 0);
            newRecords.push(record);
       }
       return newRecords;
    }
    else if(data && (data.constructor == Object)) {
        return this.addRecord(data, 0);
    }
    else {
        return null;
    }
};

/**
 * Replaces all Records in RecordSet with new data.
 *
 * @method replace
 * @param data {Object || Object[]} An object literal or array or data.
 * @return {YAHOO.widget.Record || YAHOO.widget.Record[]} A Record or array of Records.
 */
YAHOO.widget.RecordSet.prototype.replace = function(data) {
    if(data) {
        this.reset();
        return this.append(data);
    }
    else {
        return null;
    }
};

/**
 * Sorts RecordSet by given function.
 *
 * @method sort
 * @param fnSort {Function} Reference to a sort function.
 * @return {Array} Sorted array of Records
 */
YAHOO.widget.RecordSet.prototype.sort = function(fnSort) {
    return this._records.sort(fnSort);
};


/**
 * Removes the record at the given index from the RecordSet. If a range is
 * given, starts at the given index and removes all records in the range.
 *
 * @method deleteRecord
 * @param i {Number} Record index
 * @param range {Number} (optional) Range of records to remove, or null.
 */
YAHOO.widget.RecordSet.prototype.deleteRecord = function(i, range) {
    if(!YAHOO.lang.isNumber(range)) {
        range = 1;
    }
    // TODO: validate for negative values
    if(!YAHOO.lang.isNumber(i)) {
        this._records.splice(i, range);
        this._length = this._length - range;
    }
};

/**
 * Removes all Records from the RecordSet.
 *
 * @method reset
 */
YAHOO.widget.RecordSet.prototype.reset = function() {
    this._records = [];
    this._length = 0;
};


/****************************************************************************/
/****************************************************************************/
/****************************************************************************/

/**
 * The Record class defines a DataTable record.
 *
 * @class Record
 * @constructor
 * @param oConfigs {Object} (optional) Object literal of key/value pairs.
 */
YAHOO.widget.Record = function(oLiteral) {
    if(oLiteral && (oLiteral.constructor == Object)) {
        for(var sKey in oLiteral) {
            this[sKey] = oLiteral[sKey];
        }
        this.yuiRecordId = "yui-dtrec"+YAHOO.widget.Record._nCount;
        YAHOO.widget.Record._nCount++;
    }
};

/////////////////////////////////////////////////////////////////////////////
//
// Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Internal class variable to index multiple data table instances.
 *
 * @property _nCount
 * @type number
 * @private
 * @static
 */
YAHOO.widget.Record._nCount = 0;

/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * Unique name assigned at instantation, indicates original order.
 *
 * @property yuiRecordId
 * @type string
 */
YAHOO.widget.Record.prototype.yuiRecordId = null;
