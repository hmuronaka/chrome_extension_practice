// HTML DOMに対する汎用的なコード

class DomUtil {
  /** selectにoptionを追加 */
  static addOptionToSelect( selectEl, option ) {
    let optEl = document.createElement('option');
    optEl.value = option.value;
    optEl.text = option.text;
    selectEl.add(optEl);
  }

  /** selectから全てのoptionを削除 */
  static removeAllOptionsFromSelect( selectEl ) {
    for(let idx = selectEl.options.length - 1; idx >= 0; idx--) {
      selectEl.remove(idx);
    }
  }

  /** selectの選択中のoptionを返す */
  static getSelectedOption( selectEl ) {
    if( selectEl.selectedIndex < 0 ) {
      return null;
    }
    return selectEl.options[selectEl.selectedIndex];
  }

  /** selectのoptionを入れ直す */
  static reloadSelct(selectEl, options) {
    DomUtil.removeAllOptionsFromSelect(selectEl);
    for(const option of options) {
      DomUtil.addOptionToSelect( selectEl, option);
    }
  }

  /** idのelementを取得する。(見つからない場合は、一定回数retryする) */
  static async getElementByIdAsync(id, option) {
    option = option || {
      retry: 5,
      interval: 1000
    };
    return new Promise( (resolve, reject) => {
      var retryCnt = 0;
      let timer = setInterval(function() {
        let result = document.getElementById(id);
        if( result ) {
          clearInterval(timer);
          resolve(result);
        } else {
          retryCnt++;
          if( retryCnt >= option.retry ) {
            clearInterval(timer);
            reject('error');
          }
        }
      }, option.interval);
    });
  }
}
