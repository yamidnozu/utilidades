const fs = require('fs');
const path = require('path');

const SRC_DIR = 'src';

function moveFile(oldPath, newPath) {
  fs.mkdirSync(path.dirname(newPath), { recursive: true });
  fs.renameSync(oldPath, newPath);
  console.log(`Moved ${oldPath} to ${newPath}`);
}

function organizeFiles() {
  const files = [
    { oldPath: 'src\\helpers\\data-export.helper.ts', newPath: 'src/lib/core/helpers/data-export.helper.ts' },
    { oldPath: 'src\\helpers\\objects.helper.ts', newPath: 'src/lib/core/helpers/objects.helper.ts' },
    { oldPath: 'src\\helpers\\steper.helper.ts', newPath: 'src/lib/core/helpers/steper.helper.ts' },
    { oldPath: 'src\\helpers\\objects.mocks.ts', newPath: 'src/lib/core/mocks/objects.mocks.ts' },
    { oldPath: 'src\\lib\\domain\\models\\customizable-endpoint\\customizable-endpoint.gateway.ts', newPath: 'src/lib/domain/gateways/customizable-endpoint.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\customizable-endpoint\\customizable-endpoint.model.ts', newPath: 'src/lib/domain/models/customizable-endpoint.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\detail\\detail-operation.gateways.ts', newPath: 'src/lib/domain/gateways/detail-operation.gateways.ts' },
    { oldPath: 'src\\lib\\domain\\models\\detail\\detail.model.ts', newPath: 'src/lib/domain/models/detail.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\download-data-table\\download-data-table.gateway.ts', newPath: 'src/lib/domain/gateways/download-data-table.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\download-data-table\\download-data-table.model.ts', newPath: 'src/lib/domain/models/download-data-table.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\download-file\\download-file.gateway.ts', newPath: 'src/lib/domain/gateways/download-file.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\download-file\\download-file.model.ts', newPath: 'src/lib/domain/models/download-file.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\error-message\\error-manager-message-base.ts', newPath: 'src/lib/domain/models/error-manager-message-base.ts' },
    { oldPath: 'src\\lib\\domain\\models\\error-message\\error-message.gateway.ts', newPath: 'src/lib/domain/gateways/error-message.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\error-message\\error-message.model.ts', newPath: 'src/lib/domain/models/error-message.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\filterInput\\filterinput.gateway.ts', newPath: 'src/lib/domain/gateways/filterinput.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\filterInput\\filterinput.model.ts', newPath: 'src/lib/domain/models/filterinput.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\payment-plan\\detail.model.ts', newPath: 'src/lib/domain/models/payment-plan.model.ts' },
    { oldPath: 'src\\lib\\domain\\models\\payment-plan\\payment-plan.gateway.ts', newPath: 'src/lib/domain/gateways/payment-plan.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\retrieve-basic-payments\\retrieve-basic-payments.gateway.ts', newPath: 'src/lib/domain/gateways/retrieve-basic-payments.gateway.ts' },
    { oldPath: 'src\\lib\\domain\\models\\retrieve-basic-payments\\retrieve-basic-payments.model.ts', newPath: 'src/lib/domain/models/retrieve-basic-payments.model.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\detail-operation-mapper\\detail-operation-mapper.usecase.ts', newPath: 'src/lib/domain/usecases/detail-operation-mapper.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\donwload-file\\donwload-file.usecase.ts', newPath: 'src/lib/domain/usecases/donwload-file.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\download-data-table\\download-data-table.usecase.ts', newPath: 'src/lib/domain/usecases/download-data-table.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\download-payment-plan-information\\download-payment-plan-information.usecase.ts', newPath: 'src/lib/domain/usecases/download-payment-plan-information.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\error-message\\error-message.usecase.ts', newPath: 'src/lib/domain/usecases/error-message.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\error-message copy\\get-corrected-error-messages.usecase.ts', newPath: 'src/lib/domain/usecases/get-corrected-error-messages.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-advance-conditions\\get-advance-conditions.usecase.ts', newPath: 'src/lib/domain/usecases/get-advance-conditions.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-consume-from-url\\get-consume-from-url.usecase.ts', newPath: 'src/lib/domain/usecases/get-consume-from-url.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-fiilter-input\\get-fiilter-input.usecase.ts', newPath: 'src/lib/domain/usecases/get-fiilter-input.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-final-conditions\\get-final-conditions.usecase.ts', newPath: 'src/lib/domain/usecases/get-final-conditions.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-general-info\\get-general-info.usecase.ts', newPath: 'src/lib/domain/usecases/get-general-info.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-operations-list\\get-operations-list.usecase.ts', newPath: 'src/lib/domain/usecases/get-operations-list.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-payment-plan\\get-payment-plan.usecase.ts', newPath: 'src/lib/domain/usecases/get-payment-plan.usecase.ts' },
    { oldPath: 'src\\lib\\domain\\usecases\\get-retrieve-basic-payments\\get-retrieve-basic-payments.usecase.ts', newPath: 'src/lib/domain/usecases/get-retrieve-basic-payments.usecase.ts' },
    { oldPath: 'src\\lib\\ui\\components\\button-dropdown\\button-dropdown.component.html', newPath: 'src/lib/ui/components/button-dropdown/button-dropdown.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\button-dropdown\\button-dropdown.component.ts', newPath: 'src/lib/ui/components/button-dropdown/button-dropdown.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\coach-mark-detail\\coach-mark-detail.component.html', newPath: 'src/lib/ui/components/coach-mark-detail/coach-mark-detail.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\coach-mark-detail\\coach-mark-detail.component.ts', newPath: 'src/lib/ui/components/coach-mark-detail/coach-mark-detail.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\coach-mark-operations\\coach-mark-operations.component.html', newPath: 'src/lib/ui/components/coach-mark-operations/coach-mark-operations.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\coach-mark-operations\\coach-mark-operations.component.ts', newPath: 'src/lib/ui/components/coach-mark-operations/coach-mark-operations.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\filter\\filter.component.html', newPath: 'src/lib/ui/components/filter/filter.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\filter\\filter.component.configuration.ts', newPath: 'src/lib/ui/components/filter/filter.component.configuration.ts' },
    { oldPath: 'src\\lib\\ui\\components\\filter\\filter.component.ts', newPath: 'src/lib/ui/components/filter/filter.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\flow-error\\flow-error\\flow-error.component.html', newPath: 'src/lib/ui/components/flow-error/flow-error.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\flow-error\\flow-error\\flow-error.component.ts', newPath: 'src/lib/ui/components/flow-error/flow-error.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\info-card\\info-card.component.html', newPath: 'src/lib/ui/components/info-card/info-card.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\info-card\\info-card.component.ts', newPath: 'src/lib/ui/components/info-card/info-card.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\table\\table.component.html', newPath: 'src/lib/ui/components/table/table.component.html' },
    { oldPath: 'src\\lib\\ui\\components\\table\\table.component.configuration.ts', newPath: 'src/lib/ui/components/table/table.component.configuration.ts' },
    { oldPath: 'src\\lib\\ui\\components\\table\\table.component.ts', newPath: 'src/lib/ui/components/table/table.component.ts' },
    { oldPath: 'src\\lib\\ui\\components\\table\\table-column-manager.ts', newPath: 'src/lib/ui/components/table/table-column-manager.ts' },
    { oldPath: 'src\\lib\\ui\\components\\components.module.ts', newPath: 'src/lib/ui/components.module.ts' },
    { oldPath: 'src\\lib\\ui\\components\\pipe\\capitalization.pipe.ts', newPath: 'src/lib/ui/components/pipes/capitalization.pipe.ts' },
    { oldPath: 'src\\lib\\ui\\components\\pipe\\colombian-peso.pipe.ts', newPath: 'src/lib/ui/components/pipes/colombian-peso.pipe.ts' },
    { oldPath: 'src\\lib\\ui\\components\\pipe\\eval-condition.pipe.ts', newPath: 'src/lib/ui/components/pipes/eval-condition.pipe.ts' },
    { oldPath: 'src\\lib\\ui\\components\\pipe\\ng-class-for-cell.pipe.ts', newPath: 'src/lib/ui/components/pipes/ng-class-for-cell.pipe.ts' },
    { oldPath: 'src\\lib\\ui\\pages\\main\\main.component.html', newPath: 'src/lib/ui/pages/main/main.component.html' },
    { oldPath: 'src\\lib\\ui\\pages\\main\\main.component.configuration.ts', newPath: 'src/lib/ui/pages/main/main.component.configuration.ts' },
    { oldPath: 'src\\lib\\ui\\pages\\main\\main.component.ts', newPath: 'src/lib/ui/pages/main/main.component.ts' },
    { oldPath: 'src\\lib\\ui\\pages\\tab-operation-detail\\tab-operation-detail\\tab-operation-detail.component.html', newPath: 'src/lib/ui/pages/tab-operation-detail/tab-operation-detail.component.html' },
    { oldPath: 'src\\lib\\ui\\pages\\tab-operation-detail\\tab-operation-detail\\tab-operation-detail.component.configuration.ts', newPath: 'src/lib/ui/pages/tab-operation-detail/tab-operation-detail.component.configuration.ts' },
    { oldPath: 'src\\lib\\ui\\pages\\tab-operation-detail\\tab-operation-detail\\tab-operation-detail.component.ts', newPath: 'src/lib/ui/pages/tab-operation-detail/tab-operation-detail.component.ts' },
    { oldPath: 'src\\lib\\ui\\pages\\pages.module.ts', newPath: 'src/lib/ui/pages.module.ts' },
    { oldPath: 'src\\lib\\ui\\view-models\\view-models.module.ts', newPath: 'src/lib/ui/view-models/view-models.module.ts' },
    { oldPath: 'src\\lib\\configurations\\filterable-table-widget.configuration.ts', newPath: 'src/lib/configurations/filterable-table-widget.configuration.ts' },
    { oldPath: 'src\\lib\\configurations\\filterable-table-widget.module.ts', newPath: 'src/lib/configurations/filterable-table-widget.module.ts' },
    { oldPath: 'src\\lib\\configurations\\filterable-table-widget.tagging-configuration.ts', newPath: 'src/lib/configurations/filterable-table-widget.tagging-configuration.ts' },
    { oldPath: 'src\\lib\\configurations\\sdb.module.ts', newPath: 'src/lib/configurations/sdb.module.ts' },
    { oldPath: 'src\\lib\\services\\filter-service.service.ts', newPath: 'src/lib/services/filter-service.service.ts' },
    { oldPath: 'src\\lib\\services\\modal.service.ts', newPath: 'src/lib/services/modal.service.ts' },
  ];

  files.forEach(({ oldPath, newPath }) => {
    moveFile(oldPath, newPath);
  });
}

organizeFiles();