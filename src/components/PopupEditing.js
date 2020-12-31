import {
  Plugin,
  Template,
  TemplateConnector,
  TemplatePlaceholder
} from "@devexpress/dx-react-core";
import { Details } from "@material-ui/icons";
import React from "react";

export const PopupEditing = React.memo(({ popupComponent: Popup, allCompanies, detail }) => {
  return (
    <Plugin>
      <Template name="popupEditing">
        <TemplateConnector>
          {(
            {
              addedRows,
              rows,
              getRowId,
              editingRowIds,
              createRowChange,
              rowChanges,
            },
            {
              changeRow,
              commitChangedRows,
              stopEditRows,
              cancelAddedRows,
              commitAddedRows,
              changeAddedRow,
            }
          ) => {
            const isAddMode = addedRows.length > 0;
            const isEditMode = editingRowIds.length > 0;

            const editRowId = editingRowIds[0] || 0;

            const open = isEditMode || isAddMode;
            const targetRow = rows.filter(
              (row) => getRowId(row) === editRowId
            )[0];
            const changedRow = isAddMode
              ? addedRows[0]
              : { ...targetRow, ...rowChanges[editRowId] };

            const processValueChange = (fieldName, newValue) => {
              const changeArgs = {
                rowId: editRowId,
                change: createRowChange(changedRow, newValue, fieldName),
              };

              if (isAddMode) {
                changeAddedRow(changeArgs);
              } else {
                changeRow(changeArgs);
              }
            };
            const applyChanges = () => {
              if (isEditMode) {
                commitChangedRows({ rowIds: editingRowIds });
              } else {
                commitAddedRows({ rowIds: [0] });
              }
              stopEditRows({ rowIds: editingRowIds });
            };
            const cancelChanges = () => {
              if (isAddMode) {
                cancelAddedRows({ rowIds: [0] });
              }
              stopEditRows({ rowIds: editingRowIds });
            };
            
            detail = {...detail, type: isAddMode ? 'Add' : 'Edit'}  

            return (
              <Popup
                open={open}
                row={changedRow}
                onChange={processValueChange}
                onApplyChanges={applyChanges}
                onCancelChanges={cancelChanges}
                allCompanies={allCompanies} 
                detail={detail}
                />
            );
          }}
        </TemplateConnector>
      </Template>
      <Template name="root">
        <TemplatePlaceholder />
        <TemplatePlaceholder name="popupEditing" />
      </Template>
    </Plugin>
  );
});
