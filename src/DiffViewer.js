import React, { PureComponent } from 'react';
import { difference } from 'lodash';
import PropTypes from 'prop-types';

class DiffViewer extends PureComponent {
  /*
  Compute and Show Drifts for Object Type Inputs
  */

  renderObjectDiffView(baseObj, newObj, level) {
    const policyKeys = Object.keys(baseObj);
    const switchKeys = Object.keys(newObj);
    const addedKeys = difference(switchKeys, policyKeys);
    const lastSwitchKey = switchKeys[switchKeys.length - 1];
    const levelPaddingValue = this.getLevelPaddingValue(level);
    return (
      <>
        {policyKeys.map((blockKey, index) =>
          baseObj.hasOwnProperty(blockKey) &&
          newObj.hasOwnProperty(blockKey) &&
          baseObj[blockKey] !== newObj[blockKey] ? (
            Array.isArray(baseObj[blockKey]) ? (
              <React.Fragment key={blockKey}>
                {this.renderArrayDiffView(
                  baseObj[blockKey],
                  newObj[blockKey],
                  blockKey,
                  this.getClassValue(
                    baseObj[blockKey].length,
                    newObj[blockKey].length
                  ),
                  level
                )}
              </React.Fragment>
            ) : typeof baseObj[blockKey] === 'object' ? (
              <React.Fragment key={blockKey}>
                <tr>
                  <td style={{ paddingLeft: levelPaddingValue }}>
                    {JSON.stringify(blockKey) + ':'}
                  </td>
                  <td style={{ paddingLeft: levelPaddingValue }}>
                    {JSON.stringify(blockKey) + ':'}
                  </td>
                </tr>
                {this.renderObjectDiffView(
                  baseObj[blockKey],
                  newObj[blockKey],
                  level + 1
                )}
              </React.Fragment>
            ) : (
              <tr className="modified" key={blockKey}>
                <td style={{ paddingLeft: levelPaddingValue }}>
                  {JSON.stringify(blockKey) + ':'}
                  {' ' + JSON.stringify(baseObj[blockKey])}
                  {index < policyKeys.length - 1 && ','}
                </td>
                <td style={{ paddingLeft: levelPaddingValue }}>
                  {JSON.stringify(blockKey) + ':'}
                  {' ' + JSON.stringify(newObj[blockKey])}
                  {addedKeys.length === 0
                    ? blockKey !== lastSwitchKey && ','
                    : ','}
                </td>
              </tr>
            )
          ) : baseObj.hasOwnProperty(blockKey) &&
            !newObj.hasOwnProperty(blockKey) ? (
            Array.isArray(baseObj[blockKey]) ? (
              <React.Fragment key={blockKey}>
                {this.renderArrayDiffView(
                  baseObj[blockKey],
                  [],
                  blockKey,
                  'deleted',
                  level
                )}
              </React.Fragment>
            ) : typeof baseObj[blockKey] === 'object' ? (
              <React.Fragment key={blockKey}>
                <tr>
                  <td
                    style={{ paddingLeft: levelPaddingValue }}
                    className="deleted"
                  >
                    {JSON.stringify(blockKey) + ':'}
                  </td>
                  <td className="empty" />
                </tr>
                {this.renderObjectView(baseObj[blockKey], true, level + 1)}
              </React.Fragment>
            ) : (
              <tr key={blockKey}>
                <td
                  className="deleted"
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(blockKey) + ':'}
                  {' ' + JSON.stringify(baseObj[blockKey])}
                  {index < policyKeys.length - 1 && ','}
                </td>
                <td className="empty" />
              </tr>
            )
          ) : baseObj.hasOwnProperty(blockKey) &&
            newObj.hasOwnProperty(blockKey) &&
            baseObj[blockKey] === newObj[blockKey] ? (
            <tr key={blockKey}>
              <td style={{ paddingLeft: levelPaddingValue }}>
                {JSON.stringify(blockKey) + ':'}
                {' ' + JSON.stringify(baseObj[blockKey])}
                {index < policyKeys.length - 1 && ','}
              </td>
              <td style={{ paddingLeft: levelPaddingValue }}>
                {JSON.stringify(blockKey) + ':'}
                {' ' + JSON.stringify(newObj[blockKey])}
                {addedKeys.length === 0
                  ? blockKey !== lastSwitchKey && ','
                  : ','}
              </td>
            </tr>
          ) : null
        )}
        {addedKeys.map((blockKey, index) =>
          !baseObj.hasOwnProperty(blockKey) &&
          newObj.hasOwnProperty(blockKey) ? (
            Array.isArray(newObj[blockKey]) ? (
              <React.Fragment key={blockKey}>
                {this.renderArrayDiffView(
                  [],
                  newObj[blockKey],
                  blockKey,
                  'added',
                  level
                )}
              </React.Fragment>
            ) : typeof newObj[blockKey] === 'object' ? (
              <React.Fragment key={blockKey}>
                <tr>
                  <td className="empty" />
                  <td
                    style={{ paddingLeft: levelPaddingValue }}
                    className="added"
                  >
                    {JSON.stringify(blockKey) + ':'}
                  </td>
                </tr>
                {this.renderObjectView(newObj[blockKey], false, level + 1)}
              </React.Fragment>
            ) : (
              <tr key={blockKey}>
                <td className="empty" />
                <td
                  className="added"
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(blockKey) + ':'}
                  {' ' + JSON.stringify(newObj[blockKey])}
                  {index < addedKeys.length - 1 && ','}
                </td>
              </tr>
            )
          ) : null
        )}
      </>
    );
  }

  /*
  Compute and Show Drifts for Array Type Inputs
  */

  renderArrayDiffView(baseArray, newArray, propertyName, classValue, level) {
    const isBaseArrayGreater = baseArray.length > newArray.length;
    const arrayToIterate = isBaseArrayGreater ? baseArray : newArray;
    const arrayToCheck = isBaseArrayGreater ? newArray : baseArray;
    const indexLimit = isBaseArrayGreater ? newArray.length : baseArray.length;
    const levelPaddingValue = this.getLevelPaddingValue(level);
    return (
      <>
        {propertyName ? (
          isBaseArrayGreater ||
          (baseArray.length === 0 && classValue === 'deleted') ? (
            <tr>
              <td
                style={{ paddingLeft: levelPaddingValue }}
                className={classValue}
              >
                {JSON.stringify(propertyName) + ':'}
              </td>
              {newArray.length > 0 ? (
                <td
                  className={classValue}
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(propertyName) + ':'}
                </td>
              ) : (
                <td className="empty" />
              )}
            </tr>
          ) : (
            <tr>
              {baseArray.length > 0 ? (
                <td
                  className={classValue}
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(propertyName) + ':'}
                </td>
              ) : (
                <td className="empty" />
              )}
              {
                <td
                  style={{ paddingLeft: levelPaddingValue }}
                  className={classValue}
                >
                  {JSON.stringify(propertyName) + ':'}
                </td>
              }
            </tr>
          )
        ) : null}
        {arrayToIterate.map((blockObjData, index) =>
          Array.isArray(arrayToIterate[index]) &&
          index < indexLimit &&
          arrayToCheck.length > 0 ? (
            <React.Fragment key={blockObjData}>
              {this.renderArrayDiffView(
                baseArray[index],
                newArray[index],
                blockObjData,
                null,
                level
              )}
            </React.Fragment>
          ) : typeof arrayToIterate[index] === 'object' ? (
            arrayToCheck.length > 0 && index < indexLimit ? (
              <React.Fragment key={blockObjData}>
                {this.renderObjectDiffView(
                  baseArray[index],
                  newArray[index],
                  level + 1
                )}
                <tr className="blank-row" />
              </React.Fragment>
            ) : (
              <React.Fragment key={blockObjData}>
                {this.renderObjectView(
                  blockObjData,
                  isBaseArrayGreater,
                  level + 1
                )}
                <tr className="blank-row" />
              </React.Fragment>
            )
          ) : (
            <React.Fragment key={blockObjData}>
              {this.renderArrayPropertyView(
                baseArray[index],
                newArray[index],
                level + 1,
                isBaseArrayGreater
                  ? index < baseArray.length - 1
                  : index < indexLimit - 1,
                isBaseArrayGreater
                  ? index < indexLimit - 1
                  : index < newArray.length - 1,
                blockObjData
              )}
              <tr className="blank-row" />
            </React.Fragment>
          )
        )}
      </>
    );
  }

  /*
   Helper Function to show the Drifts for Extra objects present inside any of the array type inputs i.e source or destination.
  */

  renderObjectView(obj, isDelete, level) {
    const objectKeys = Object.keys(obj);
    const levelPaddingValue = this.getLevelPaddingValue(level);
    return (
      <>
        {objectKeys.map((blockObjKey, index) =>
          isDelete ? (
            Array.isArray(obj[blockObjKey]) ? (
              <React.Fragment key={blockObjKey}>
                {this.renderArrayDiffView(
                  obj[blockObjKey],
                  [],
                  blockObjKey,
                  'deleted',
                  level
                )}
              </React.Fragment>
            ) : typeof obj[blockObjKey] === 'object' ? (
              <React.Fragment key={blockObjKey}>
                <tr>
                  <td
                    className="deleted"
                    style={{ paddingLeft: levelPaddingValue }}
                  >
                    {JSON.stringify(blockObjKey) + ':'}
                  </td>
                  <td className="empty" />
                </tr>
                {this.renderObjectView(obj[blockObjKey], true, level + 1)}
              </React.Fragment>
            ) : (
              <tr key={blockObjKey}>
                <td
                  className="deleted"
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(blockObjKey) + ':'}
                  {' ' + JSON.stringify(obj[blockObjKey])}
                  {index < objectKeys.length - 1 && ','}
                </td>
                <td className="empty" />
              </tr>
            )
          ) : Array.isArray(obj[blockObjKey]) ? (
            <>
              {this.renderArrayDiffView(
                [],
                obj[blockObjKey],
                blockObjKey,
                'added',
                level
              )}
            </>
          ) : typeof obj[blockObjKey] === 'object' ? (
            <>
              <tr key={blockObjKey}>
                <td className="empty" />
                <td
                  className="added"
                  style={{ paddingLeft: levelPaddingValue }}
                >
                  {JSON.stringify(blockObjKey) + ':'}
                </td>
              </tr>
              {this.renderObjectView(obj[blockObjKey], false, level + 1)}
            </>
          ) : (
            <tr key={blockObjKey}>
              <td className="empty" />
              <td className="added" style={{ paddingLeft: levelPaddingValue }}>
                {JSON.stringify(blockObjKey) + ':'}
                {' ' + JSON.stringify(obj[blockObjKey])}
                {index < objectKeys.length - 1 && ','}
              </td>
            </tr>
          )
        )}
      </>
    );
  }

  /*
  Compute and Show Drifts for Primitive Data type Array values i.e String,Number etc.
  */

  renderArrayPropertyView(
    propertyOne,
    propertyTwo,
    level,
    isPropertyOneComma,
    isPropertyTwoComma,
    keyValue
  ) {
    const levelPaddingValue = this.getLevelPaddingValue(level);
    return propertyOne && propertyTwo && propertyOne !== propertyTwo ? (
      <React.Fragment key={keyValue}>
        <tr className="modified" key={keyValue}>
          <td style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyOne)}
            {isPropertyOneComma && ','}
          </td>
          <td style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyTwo)}
            {isPropertyTwoComma && ','}
          </td>
        </tr>
      </React.Fragment>
    ) : !propertyOne && propertyTwo ? (
      <React.Fragment key={keyValue}>
        <tr key={keyValue}>
          <td className="empty" />
          <td className="added" style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyTwo)}
            {isPropertyTwoComma && ','}
          </td>
        </tr>
      </React.Fragment>
    ) : propertyOne && !propertyTwo ? (
      <React.Fragment key={keyValue}>
        <tr key={keyValue}>
          <td className="deleted" style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyOne)}
            {isPropertyOneComma && ','}
          </td>
          <td className="empty" />
        </tr>
      </React.Fragment>
    ) : propertyOne && propertyTwo && propertyOne === propertyTwo ? (
      <React.Fragment key={keyValue}>
        <tr>
          <td style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyOne)}
            {isPropertyOneComma && ','}
          </td>
          <td style={{ paddingLeft: levelPaddingValue }}>
            {JSON.stringify(propertyTwo)}
            {isPropertyTwoComma && ','}
          </td>
        </tr>
      </React.Fragment>
    ) : null;
  }

  /*
   Helper function to get the required class value based on the given input lengths.
  */

  getClassValue(lengthOne, lengthTwo) {
    let classValue = null;
    if (lengthOne === 0 && lengthTwo > 0) {
      classValue = 'added';
    } else if (lengthTwo === 0 && lengthOne > 0) {
      classValue = 'deleted';
    }
    return classValue;
  }

  /*
   Helper function to get the required padding value depending on the given input level.
  */

  getLevelPaddingValue(level) {
    return level * 10 + 30;
  }

  render() {
    return (
      <table className="diff">
        <tbody>
          {Array.isArray(this.props.destination) ||
          Array.isArray(this.props.source)
            ? this.renderArrayDiffView(
                this.props.source,
                this.props.destination,
                null,
                this.getClassValue(
                  this.props.source.length,
                  this.props.destination.length
                ),
                0
              )
            : this.renderObjectDiffView(
                this.props.source,
                this.props.destination,
                0
              )}
        </tbody>
      </table>
    );
  }
}
DiffViewer.propTypes = {
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  destination: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};
export default DiffViewer;
