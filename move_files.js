// const fs = require('fs');
// const path = require('path');

// // Función para mover un archivo a su carpeta de destino
// function moveFile(sourcePath, destinationPath) {
//     const destinationDir = path.dirname(destinationPath);
//     if (!fs.existsSync(destinationDir)) {
//         fs.mkdirSync(destinationDir, { recursive: true });
//     }
//     fs.renameSync(sourcePath, destinationPath);
//     console.log(`Archivo movido: ${sourcePath} -> ${destinationPath}`);
// }

// // Objeto que mapea las rutas de origen a las rutas de destino
// const fileMapping = {
//     // 'app-routing.module.ts': 'app/app-routing.module.ts',
//     // 'app.component.css': 'app/app.component.css',
//     // 'app.component.html': 'app/app.component.html',
//     // 'app.component.spec.ts': 'app/app.component.spec.ts',
//     // 'app.component.ts': 'app/app.component.ts',
//     // 'app.module.ts': 'app/app.module.ts',
//     // 'RESUMEN.TXT': 'app/RESUMEN.TXT',
//     // '__app.module.ts': 'app/__app.module.ts',

//     'core/core.module.ts': 'domain/core/core.module.ts',

//     'shared/shared.module.ts': 'shared/shared.module.ts',

//     '_ui/ui-routing.module.ts': 'ui/ui-routing.module.ts',
//     '_ui/ui.module.ts': 'ui/ui.module.ts',

//     'core/helpers/assert.model.ts': 'domain/core/helpers/assert.model.ts',
//     'core/helpers/download-file.spec.ts': 'domain/core/helpers/download-file.spec.ts',
//     'core/helpers/download-file.ts': 'domain/core/helpers/download-file.ts',
//     'core/helpers/error.helper.ts': 'domain/core/helpers/error.helper.ts',
//     'core/helpers/generate-file-name.spec.ts': 'domain/core/helpers/generate-file-name.spec.ts',
//     'core/helpers/generate-file-name.ts': 'domain/core/helpers/generate-file-name.ts',
//     'core/helpers/labels.model.ts': 'domain/core/helpers/labels.model.ts',
//     'core/helpers/mappers.ts': 'domain/core/helpers/mappers.ts',

//     'core/estado/global.service.spec.ts': 'domain/core/estado/global.service.spec.ts',
//     'core/estado/global.service.ts': 'domain/core/estado/global.service.ts',
//     'core/estado/transform-amount-to-number.spec.ts': 'domain/core/estado/transform-amount-to-number.spec.ts',
//     'core/estado/transform-amount-to-number.ts': 'domain/core/estado/transform-amount-to-number.ts',

//     'core/http/api.interceptor.spec.ts': 'domain/core/http/api.interceptor.spec.ts',
//     'core/http/api.interceptor.ts': 'domain/core/http/api.interceptor.ts',

//     'core/mocks/mocks.model.ts': 'domain/core/mocks/mocks.model.ts',

//     'core/models/alert.model.ts': 'domain/core/models/alert.model.ts',
//     'core/models/auth.model.ts': 'domain/core/models/auth.model.ts',
//     'core/models/context.model.ts': 'domain/core/models/context.model.ts',
//     'core/models/detail.model.ts': 'domain/core/models/detail.model.ts',
//     'core/models/download.model.ts': 'domain/core/models/download.model.ts',
//     'core/models/error.model.ts': 'domain/core/models/error.model.ts',
//     'core/models/responses.model.ts': 'domain/core/models/responses.model.ts',

//     'core/services/auth.service.spec.ts': 'domain/core/services/auth.service.spec.ts',
//     'core/services/auth.service.ts': 'domain/core/services/auth.service.ts',
//     'core/services/cache.service.spec.ts': 'domain/core/services/cache.service.spec.ts',
//     'core/services/cache.service.ts': 'domain/core/services/cache.service.ts',
//     'core/services/control-error.service.spec.ts': 'domain/core/services/control-error.service.spec.ts',
//     'core/services/control-error.service.ts': 'domain/core/services/control-error.service.ts',
//     'core/services/loading.service.spec.ts': 'domain/core/services/loading.service.spec.ts',
//     'core/services/loading.service.ts': 'domain/core/services/loading.service.ts',
//     'core/services/modal.service.spec.ts': 'domain/core/services/modal.service.spec.ts',
//     'core/services/modal.service.ts': 'domain/core/services/modal.service.ts',
//     'core/services/navigation-history.service.spec.ts': 'domain/core/services/navigation-history.service.spec.ts',
//     'core/services/navigation-history.service.ts': 'domain/core/services/navigation-history.service.ts',
//     'core/services/override-pdf-utils-service.service.spec.ts': 'domain/core/services/override-pdf-utils-service.service.spec.ts',
//     'core/services/override-pdf-utils-service.service.ts': 'domain/core/services/override-pdf-utils-service.service.ts',
//     'core/services/theme.service.spec.ts': 'domain/core/services/theme.service.spec.ts',
//     'core/services/theme.service.ts': 'domain/core/services/theme.service.ts',

//     'core/states/customer-state.service.spec.ts': 'domain/core/states/customer-state.service.spec.ts',
//     'core/states/customer-state.service.ts': 'domain/core/states/customer-state.service.ts',

//     'core/utils/headers.ts': 'domain/core/utils/headers.ts',
//     'core/utils/mappers.ts': 'domain/core/utils/mappers.ts',
//     'core/utils/utils.ts': 'domain/core/utils/utils.ts',

//     'shared/sdb/sdb.module.ts': 'shared/sdb/sdb.module.ts',

//     '_ui/pages/anticipos-routing.module.ts': 'ui/pages/anticipos-routing.module.ts',
//     '_ui/pages/anticipos.module.ts': 'ui/pages/anticipos.module.ts',
//     '_ui/pages/definitivas-routing.module.ts': 'ui/pages/definitivas-routing.module.ts',
//     '_ui/pages/definitivas.module.ts': 'ui/pages/definitivas.module.ts',
//     '_ui/pages/payment-routing.module.ts': 'ui/pages/payment-routing.module.ts',
//     '_ui/pages/payment.module.ts': 'ui/pages/payment.module.ts',

//     'core/components/error/error.component.css': 'domain/core/components/error/error.component.css',
//     'core/components/error/error.component.html': 'domain/core/components/error/error.component.html',
//     'core/components/error/error.component.spec.ts': 'domain/core/components/error/error.component.spec.ts',
//     'core/components/error/error.component.ts': 'domain/core/components/error/error.component.ts',

//     'core/components/schedule-restriction-screen/schedule-restriction-screen.component.css': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.css',
//     'core/components/schedule-restriction-screen/schedule-restriction-screen.component.html': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.html',
//     'core/components/schedule-restriction-screen/schedule-restriction-screen.component.spec.ts': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.spec.ts',
//     'core/components/schedule-restriction-screen/schedule-restriction-screen.component.ts': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.ts',

//     'core/services/billing-service/billing-download.service.spec.ts': 'domain/core/services/billing-service/billing-download.service.spec.ts',
//     'core/services/billing-service/billing-download.service.ts': 'domain/core/services/billing-service/billing-download.service.ts',

//     'core/services/payment-plan-service/payment-plan.service.spec.ts': 'domain/core/services/payment-plan-service/payment-plan.service.spec.ts',
//     'core/services/payment-plan-service/payment-plan.service.ts': 'domain/core/services/payment-plan-service/payment-plan.service.ts',

//     '_infraestructure/driven-adapter/download-file/download-file.service.spec.ts': 'infraestructure/driven-adapters/download-file/download-file.service.spec.ts',
//     '_infraestructure/driven-adapter/download-file/download-file.service.ts': 'infraestructure/driven-adapters/download-file/download-file.service.ts',

//     '_infraestructure/driven-adapter/payment-voucher/get-payment-voucher.service.spec.ts': 'infraestructure/driven-adapters/payment-voucher/get-payment-voucher.service.spec.ts',
//     '_infraestructure/driven-adapter/payment-voucher/get-payment-voucher.service.ts': 'infraestructure/driven-adapters/payment-voucher/get-payment-voucher.service.ts',
//     '_infraestructure/driven-adapter/payment-voucher/pdf-items-pdf-mapper.service.ts': 'infraestructure/driven-adapters/payment-voucher/pdf-items-pdf-mapper.service.ts',

//     '_ui/components/operaciones/operaciones-routing.module.ts': 'ui/components/operaciones/operaciones-routing.module.ts',
//     '_ui/components/operaciones/operaciones.module.ts': 'ui/components/operaciones/operaciones.module.ts',

//     '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.css': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.css',
//     '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.html': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.html',
//     '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.spec.ts': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.spec.ts',
//     '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.ts': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.ts',

//     '_ui/pages/advance-stage/main-anticipos.component.css': 'ui/pages/advance-stage/main-anticipos.component.css',
//     '_ui/pages/advance-stage/main-anticipos.component.html': 'ui/pages/advance-stage/main-anticipos.component.html',
//     '_ui/pages/advance-stage/main-anticipos.component.spec.ts': 'ui/pages/advance-stage/main-anticipos.component.spec.ts',
//     '_ui/pages/advance-stage/main-anticipos.component.ts': 'ui/pages/advance-stage/main-anticipos.component.ts',

//     '_ui/pages/definitive-stage/main-definitivas.component.css': 'ui/pages/definitive-stage/main-definitivas.component.css',
//     '_ui/pages/definitive-stage/main-definitivas.component.html': 'ui/pages/definitive-stage/main-definitivas.component.html',
//     '_ui/pages/definitive-stage/main-definitivas.component.spec.ts': 'ui/pages/definitive-stage/main-definitivas.component.spec.ts',
//     '_ui/pages/definitive-stage/main-definitivas.component.ts': 'ui/pages/definitive-stage/main-definitivas.component.ts',

//     '_ui/pages/definitive-detail-operation/detail-operation.component.css': 'ui/pages/definitive-detail-operation/detail-operation.component.css',
//     '_ui/pages/definitive-detail-operation/detail-operation.component.html': 'ui/pages/definitive-detail-operation/detail-operation.component.html',
//     '_ui/pages/definitive-detail-operation/detail-operation.component.spec.ts': 'ui/pages/definitive-detail-operation/detail-operation.component.spec.ts',
//     '_ui/pages/definitive-detail-operation/detail-operation.component.ts': 'ui/pages/definitive-detail-operation/detail-operation.component.ts',

//     '_ui/pages/payment-flow/payment.component.css': 'ui/pages/payment-flow/payment.component.css',
//     '_ui/pages/payment-flow/payment.component.html': 'ui/pages/payment-flow/payment.component.html',
//     '_ui/pages/payment-flow/payment.component.spec.ts': 'ui/pages/payment-flow/payment.component.spec.ts',
//     '_ui/pages/payment-flow/payment.component.ts': 'ui/pages/payment-flow/payment.component.ts',

//     '_ui/shared/components/base-detail-operation.component.ts': 'ui/shared/components/base-detail-operation.component.ts',
//     '_ui/shared/components/base-filterable.component.ts': 'ui/shared/components/base-filterable.component.ts',

//     '_ui/shared/constants/shared.constants.ts': 'ui/shared/constants/shared.constants.ts',

//     '_ui/shared/configurations/filter.configurations.ts': 'ui/shared/configurations/filter.configurations.ts',
//     '_ui/shared/configurations/table.configurations.ts': 'ui/shared/configurations/table.configurations.ts',

//     '_ui/pages/finish-payment/finish-payment.component.css': 'ui/pages/finish-payment/finish-payment.component.css',
//     '_ui/pages/finish-payment/finish-payment.component.html': 'ui/pages/finish-payment/finish-payment.component.html',
//     '_ui/pages/finish-payment/finish-payment.component.spec.ts': 'ui/pages/finish-payment/finish-payment.component.spec.ts',
//     '_ui/pages/finish-payment/finish-payment.component.ts': 'ui/pages/finish-payment/finish-payment.component.ts',

//     '_ui/utils/aux_class/error-modal.ts': 'ui/utils/aux_class/error-modal.ts',

//     '_ui/utils/models/general.model.ts': 'ui/utils/models/general.model.ts',

//     '_ui/utils/constants/routes.constants.ts': 'ui/utils/constants/routes.constants.ts',

//     '_ui/utils/types/general.types.ts': 'ui/utils/types/general.types.ts',

//     '_ui/components/operaciones/services/customer-info.service.spec.ts': 'ui/components/operaciones/services/customer-info.service.spec.ts',
//     '_ui/components/operaciones/services/customer-info.service.ts': 'ui/components/operaciones/services/customer-info.service.ts',

//     '_ui/components/operaciones/resolvers/access.resolve.spec.ts': 'ui/components/operaciones/resolvers/access.resolve.spec.ts',
//     '_ui/components/operaciones/resolvers/access.resolve.ts': 'ui/components/operaciones/resolvers/access.resolve.ts',
//     '_ui/components/operaciones/resolvers/layout.resolver.ts': 'ui/components/operaciones/resolvers/layout.resolver.ts',

//     '_ui/components/payment/services/pdf-items-pdf-mapper.service.spec.ts': 'ui/components/payment/services/pdf-items-pdf-mapper.service.spec.ts',
//     '_ui/components/payment/services/pdf-items-pdf-mapper.service.ts': 'ui/components/payment/services/pdf-items-pdf-mapper.service.ts',

//     '_ui/shared/services/alert/alert.service.spec.ts': 'ui/shared/services/alert/alert.service.spec.ts',
//     '_ui/shared/services/alert/alert.service.ts': 'ui/shared/services/alert/alert.service.ts',

//     '_ui/shared/services/download/download-service.service.spec.ts': 'ui/shared/services/download/download-service.service.spec.ts',
//     '_ui/shared/services/download/download-service.service.ts': 'ui/shared/services/download/download-service.service.ts',
//     '_ui/shared/services/download/download-services.module.ts': 'ui/shared/services/download/download-services.module.ts',

//     '_ui/utils/configs/anticipos-main/button-dropdown.config.ts': 'ui/utils/configs/anticipos-main/button-dropdown.config.ts',
//     '_ui/utils/configs/anticipos-main/filter.config.ts': 'ui/utils/configs/anticipos-main/filter.config.ts',
//     '_ui/utils/configs/anticipos-main/tab.config.ts': 'ui/utils/configs/anticipos-main/tab.config.ts',
//     '_ui/utils/configs/anticipos-main/table.config.ts': 'ui/utils/configs/anticipos-main/table.config.ts',

//     '_ui/utils/configs/definitivas-main/button-dropdown.config.ts': 'ui/utils/configs/definitivas-main/button-dropdown.config.ts',
//     '_ui/utils/configs/definitivas-main/filter.config.ts': 'ui/utils/configs/definitivas-main/filter.config.ts',
//     '_ui/utils/configs/definitivas-main/tab.configuration.ts': 'ui/utils/configs/definitivas-main/tab.configuration.ts',
//     '_ui/utils/configs/definitivas-main/table.config.ts': 'ui/utils/configs/definitivas-main/table.config.ts',

//     '_ui/components/operaciones/components/button-contact/button-contact.component.css': 'ui/components/operaciones/components/button-contact/button-contact.component.css',
//     '_ui/components/operaciones/components/button-contact/button-contact.component.html': 'ui/components/operaciones/components/button-contact/button-contact.component.html',
//     '_ui/components/operaciones/components/button-contact/button-contact.component.spec.ts': 'ui/components/operaciones/components/button-contact/button-contact.component.spec.ts',
//     '_ui/components/operaciones/components/button-contact/button-contact.component.ts': 'ui/components/operaciones/components/button-contact/button-contact.component.ts',

//     '_ui/components/operaciones/components/layout/layout.component.css': 'ui/components/operaciones/components/layout/layout.component.css',
//     '_ui/components/operaciones/components/layout/layout.component.html': 'ui/components/operaciones/components/layout/layout.component.html',
//     '_ui/components/operaciones/components/layout/layout.component.spec.ts': 'ui/components/operaciones/components/layout/layout.component.spec.ts',
//     '_ui/components/operaciones/components/layout/layout.component.ts': 'ui/components/operaciones/components/layout/layout.component.ts',

//     '_ui/components/operaciones/components/home/home.component.html': 'ui/components/operaciones/components/home/home.component.html',
//     '_ui/components/operaciones/components/home/home.component.scss': 'ui/components/operaciones/components/home/home.component.scss',
//     '_ui/components/operaciones/components/home/home.component.spec.ts': 'ui/components/operaciones/components/home/home.component.spec.ts',
//     '_ui/components/operaciones/components/home/home.component.ts': 'ui/components/operaciones/components/home/home.component.ts',

//     '_ui/components/payment/components/payment-layout/payment-layout.component.css': 'ui/components/payment/components/payment-layout/payment-layout.component.css',
//     '_ui/components/payment/components/payment-layout/payment-layout.component.html': 'ui/components/payment/components/payment-layout/payment-layout.component.html',
//     '_ui/components/payment/components/payment-layout/payment-layout.component.spec.ts': 'ui/components/payment/components/payment-layout/payment-layout.component.spec.ts',
//     '_ui/components/payment/components/payment-layout/payment-layout.component.ts': 'ui/components/payment/components/payment-layout/payment-layout.component.ts'
// };

// // Mover los archivos a sus carpetas de destino
// Object.entries(fileMapping).forEach(([sourcePath, destinationPath]) => {
//     if (fs.existsSync(sourcePath)) {
//         moveFile(sourcePath, destinationPath);
//     }
// });

// console.log('Todos los archivos han sido movidos a sus respectivas carpetas de destino.');


const fileMapping = {
    // 'app-routing.module.ts': 'app/app-routing.module.ts',
    // 'app.component.css': 'app/app.component.css',
    // 'app.component.html': 'app/app.component.html',
    // 'app.component.spec.ts': 'app/app.component.spec.ts',
    // 'app.component.ts': 'app/app.component.ts',
    // 'app.module.ts': 'app/app.module.ts',
    // 'RESUMEN.TXT': 'app/RESUMEN.TXT',
    // '__app.module.ts': 'app/__app.module.ts',

    'core/core.module.ts': 'domain/core/core.module.ts',

    'shared/shared.module.ts': 'shared/shared.module.ts',

    '_ui/ui-routing.module.ts': 'ui/ui-routing.module.ts',
    '_ui/ui.module.ts': 'ui/ui.module.ts',

    'core/helpers/assert.model.ts': 'domain/core/helpers/assert.model.ts',
    'core/helpers/download-file.spec.ts': 'domain/core/helpers/download-file.spec.ts',
    'core/helpers/download-file.ts': 'domain/core/helpers/download-file.ts',
    'core/helpers/error.helper.ts': 'domain/core/helpers/error.helper.ts',
    'core/helpers/generate-file-name.spec.ts': 'domain/core/helpers/generate-file-name.spec.ts',
    'core/helpers/generate-file-name.ts': 'domain/core/helpers/generate-file-name.ts',
    'core/helpers/labels.model.ts': 'domain/core/helpers/labels.model.ts',
    'core/helpers/mappers.ts': 'domain/core/helpers/mappers.ts',

    'core/estado/global.service.spec.ts': 'domain/core/estado/global.service.spec.ts',
    'core/estado/global.service.ts': 'domain/core/estado/global.service.ts',
    'core/estado/transform-amount-to-number.spec.ts': 'domain/core/estado/transform-amount-to-number.spec.ts',
    'core/estado/transform-amount-to-number.ts': 'domain/core/estado/transform-amount-to-number.ts',

    'core/http/api.interceptor.spec.ts': 'domain/core/http/api.interceptor.spec.ts',
    'core/http/api.interceptor.ts': 'domain/core/http/api.interceptor.ts',

    'core/mocks/mocks.model.ts': 'domain/core/mocks/mocks.model.ts',

    'core/models/alert.model.ts': 'domain/core/models/alert.model.ts',
    'core/models/auth.model.ts': 'domain/core/models/auth.model.ts',
    'core/models/context.model.ts': 'domain/core/models/context.model.ts',
    'core/models/detail.model.ts': 'domain/core/models/detail.model.ts',
    'core/models/download.model.ts': 'domain/core/models/download.model.ts',
    'core/models/error.model.ts': 'domain/core/models/error.model.ts',
    'core/models/responses.model.ts': 'domain/core/models/responses.model.ts',

    'core/services/auth.service.spec.ts': 'domain/core/services/auth.service.spec.ts',
    'core/services/auth.service.ts': 'domain/core/services/auth.service.ts',
    'core/services/cache.service.spec.ts': 'domain/core/services/cache.service.spec.ts',
    'core/services/cache.service.ts': 'domain/core/services/cache.service.ts',
    'core/services/control-error.service.spec.ts': 'domain/core/services/control-error.service.spec.ts',
    'core/services/control-error.service.ts': 'domain/core/services/control-error.service.ts',
    'core/services/loading.service.spec.ts': 'domain/core/services/loading.service.spec.ts',
    'core/services/loading.service.ts': 'domain/core/services/loading.service.ts',
    'core/services/modal.service.spec.ts': 'domain/core/services/modal.service.spec.ts',
    'core/services/modal.service.ts': 'domain/core/services/modal.service.ts',
    'core/services/navigation-history.service.spec.ts': 'domain/core/services/navigation-history.service.spec.ts',
    'core/services/navigation-history.service.ts': 'domain/core/services/navigation-history.service.ts',
    'core/services/override-pdf-utils-service.service.spec.ts': 'domain/core/services/override-pdf-utils-service.service.spec.ts',
    'core/services/override-pdf-utils-service.service.ts': 'domain/core/services/override-pdf-utils-service.service.ts',
    'core/services/theme.service.spec.ts': 'domain/core/services/theme.service.spec.ts',
    'core/services/theme.service.ts': 'domain/core/services/theme.service.ts',

    'core/states/customer-state.service.spec.ts': 'domain/core/states/customer-state.service.spec.ts',
    'core/states/customer-state.service.ts': 'domain/core/states/customer-state.service.ts',

    'core/utils/headers.ts': 'domain/core/utils/headers.ts',
    'core/utils/mappers.ts': 'domain/core/utils/mappers.ts',
    'core/utils/utils.ts': 'domain/core/utils/utils.ts',

    'shared/sdb/sdb.module.ts': 'shared/sdb/sdb.module.ts',

    '_ui/pages/anticipos-routing.module.ts': 'ui/pages/anticipos-routing.module.ts',
    '_ui/pages/anticipos.module.ts': 'ui/pages/anticipos.module.ts',
    '_ui/pages/definitivas-routing.module.ts': 'ui/pages/definitivas-routing.module.ts',
    '_ui/pages/definitivas.module.ts': 'ui/pages/definitivas.module.ts',
    '_ui/pages/payment-routing.module.ts': 'ui/pages/payment-routing.module.ts',
    '_ui/pages/payment.module.ts': 'ui/pages/payment.module.ts',

    'core/components/error/error.component.css': 'domain/core/components/error/error.component.css',
    'core/components/error/error.component.html': 'domain/core/components/error/error.component.html',
    'core/components/error/error.component.spec.ts': 'domain/core/components/error/error.component.spec.ts',
    'core/components/error/error.component.ts': 'domain/core/components/error/error.component.ts',

    'core/components/schedule-restriction-screen/schedule-restriction-screen.component.css': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.css',
    'core/components/schedule-restriction-screen/schedule-restriction-screen.component.html': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.html',
    'core/components/schedule-restriction-screen/schedule-restriction-screen.component.spec.ts': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.spec.ts',
    'core/components/schedule-restriction-screen/schedule-restriction-screen.component.ts': 'domain/core/components/schedule-restriction-screen/schedule-restriction-screen.component.ts',

    'core/services/billing-service/billing-download.service.spec.ts': 'domain/core/services/billing-service/billing-download.service.spec.ts',
    'core/services/billing-service/billing-download.service.ts': 'domain/core/services/billing-service/billing-download.service.ts',

    'core/services/payment-plan-service/payment-plan.service.spec.ts': 'domain/core/services/payment-plan-service/payment-plan.service.spec.ts',
    'core/services/payment-plan-service/payment-plan.service.ts': 'domain/core/services/payment-plan-service/payment-plan.service.ts',

    '_infraestructure/driven-adapter/download-file/download-file.service.spec.ts': 'infraestructure/driven-adapters/download-file/download-file.service.spec.ts',
    '_infraestructure/driven-adapter/download-file/download-file.service.ts': 'infraestructure/driven-adapters/download-file/download-file.service.ts',

    '_infraestructure/driven-adapter/payment-voucher/get-payment-voucher.service.spec.ts': 'infraestructure/driven-adapters/payment-voucher/get-payment-voucher.service.spec.ts',
    '_infraestructure/driven-adapter/payment-voucher/get-payment-voucher.service.ts': 'infraestructure/driven-adapters/payment-voucher/get-payment-voucher.service.ts',
    '_infraestructure/driven-adapter/payment-voucher/pdf-items-pdf-mapper.service.ts': 'infraestructure/driven-adapters/payment-voucher/pdf-items-pdf-mapper.service.ts',

    '_ui/components/operaciones/operaciones-routing.module.ts': 'ui/components/operaciones/operaciones-routing.module.ts',
    '_ui/components/operaciones/operaciones.module.ts': 'ui/components/operaciones/operaciones.module.ts',

    '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.css': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.css',
    '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.html': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.html',
    '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.spec.ts': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.spec.ts',
    '_ui/pages/advance-detail-operation/detail-operation-anticipos.component.ts': 'ui/pages/advance-detail-operation/detail-operation-anticipos.component.ts',

    '_ui/pages/advance-stage/main-anticipos.component.css': 'ui/pages/advance-stage/main-anticipos.component.css',
    '_ui/pages/advance-stage/main-anticipos.component.html': 'ui/pages/advance-stage/main-anticipos.component.html',
    '_ui/pages/advance-stage/main-anticipos.component.spec.ts': 'ui/pages/advance-stage/main-anticipos.component.spec.ts',
    '_ui/pages/advance-stage/main-anticipos.component.ts': 'ui/pages/advance-stage/main-anticipos.component.ts',

    '_ui/pages/definitive-stage/main-definitivas.component.css': 'ui/pages/definitive-stage/main-definitivas.component.css',
    '_ui/pages/definitive-stage/main-definitivas.component.html': 'ui/pages/definitive-stage/main-definitivas.component.html',
    '_ui/pages/definitive-stage/main-definitivas.component.spec.ts': 'ui/pages/definitive-stage/main-definitivas.component.spec.ts',
    '_ui/pages/definitive-stage/main-definitivas.component.ts': 'ui/pages/definitive-stage/main-definitivas.component.ts',

    '_ui/pages/definitive-detail-operation/detail-operation.component.css': 'ui/pages/definitive-detail-operation/detail-operation.component.css',
    '_ui/pages/definitive-detail-operation/detail-operation.component.html': 'ui/pages/definitive-detail-operation/detail-operation.component.html',
    '_ui/pages/definitive-detail-operation/detail-operation.component.spec.ts': 'ui/pages/definitive-detail-operation/detail-operation.component.spec.ts',
    '_ui/pages/definitive-detail-operation/detail-operation.component.ts': 'ui/pages/definitive-detail-operation/detail-operation.component.ts',

    '_ui/pages/payment-flow/payment.component.css': 'ui/pages/payment-flow/payment.component.css',
    '_ui/pages/payment-flow/payment.component.html': 'ui/pages/payment-flow/payment.component.html',
    '_ui/pages/payment-flow/payment.component.spec.ts': 'ui/pages/payment-flow/payment.component.spec.ts',
    '_ui/pages/payment-flow/payment.component.ts': 'ui/pages/payment-flow/payment.component.ts',

    '_ui/shared/components/base-detail-operation.component.ts': 'ui/shared/components/base-detail-operation.component.ts',
    '_ui/shared/components/base-filterable.component.ts': 'ui/shared/components/base-filterable.component.ts',

    '_ui/shared/constants/shared.constants.ts': 'ui/shared/constants/shared.constants.ts',

    '_ui/shared/configurations/filter.configurations.ts': 'ui/shared/configurations/filter.configurations.ts',
    '_ui/shared/configurations/table.configurations.ts': 'ui/shared/configurations/table.configurations.ts',

    '_ui/pages/finish-payment/finish-payment.component.css': 'ui/pages/finish-payment/finish-payment.component.css',
    '_ui/pages/finish-payment/finish-payment.component.html': 'ui/pages/finish-payment/finish-payment.component.html',
    '_ui/pages/finish-payment/finish-payment.component.spec.ts': 'ui/pages/finish-payment/finish-payment.component.spec.ts',
    '_ui/pages/finish-payment/finish-payment.component.ts': 'ui/pages/finish-payment/finish-payment.component.ts',

    '_ui/utils/aux_class/error-modal.ts': 'ui/utils/aux_class/error-modal.ts',

    '_ui/utils/models/general.model.ts': 'ui/utils/models/general.model.ts',

    '_ui/utils/constants/routes.constants.ts': 'ui/utils/constants/routes.constants.ts',

    '_ui/utils/types/general.types.ts': 'ui/utils/types/general.types.ts',

    '_ui/components/operaciones/services/customer-info.service.spec.ts': 'ui/components/operaciones/services/customer-info.service.spec.ts',
    '_ui/components/operaciones/services/customer-info.service.ts': 'ui/components/operaciones/services/customer-info.service.ts',

    '_ui/components/operaciones/resolvers/access.resolve.spec.ts': 'ui/components/operaciones/resolvers/access.resolve.spec.ts',
    '_ui/components/operaciones/resolvers/access.resolve.ts': 'ui/components/operaciones/resolvers/access.resolve.ts',
    '_ui/components/operaciones/resolvers/layout.resolver.ts': 'ui/components/operaciones/resolvers/layout.resolver.ts',

    '_ui/components/payment/services/pdf-items-pdf-mapper.service.spec.ts': 'ui/components/payment/services/pdf-items-pdf-mapper.service.spec.ts',
    '_ui/components/payment/services/pdf-items-pdf-mapper.service.ts': 'ui/components/payment/services/pdf-items-pdf-mapper.service.ts',

    '_ui/shared/services/alert/alert.service.spec.ts': 'ui/shared/services/alert/alert.service.spec.ts',
    '_ui/shared/services/alert/alert.service.ts': 'ui/shared/services/alert/alert.service.ts',

    '_ui/shared/services/download/download-service.service.spec.ts': 'ui/shared/services/download/download-service.service.spec.ts',
    '_ui/shared/services/download/download-service.service.ts': 'ui/shared/services/download/download-service.service.ts',
    '_ui/shared/services/download/download-services.module.ts': 'ui/shared/services/download/download-services.module.ts',

    '_ui/utils/configs/anticipos-main/button-dropdown.config.ts': 'ui/utils/configs/anticipos-main/button-dropdown.config.ts',
    '_ui/utils/configs/anticipos-main/filter.config.ts': 'ui/utils/configs/anticipos-main/filter.config.ts',
    '_ui/utils/configs/anticipos-main/tab.config.ts': 'ui/utils/configs/anticipos-main/tab.config.ts',
    '_ui/utils/configs/anticipos-main/table.config.ts': 'ui/utils/configs/anticipos-main/table.config.ts',

    '_ui/utils/configs/definitivas-main/button-dropdown.config.ts': 'ui/utils/configs/definitivas-main/button-dropdown.config.ts',
    '_ui/utils/configs/definitivas-main/filter.config.ts': 'ui/utils/configs/definitivas-main/filter.config.ts',
    '_ui/utils/configs/definitivas-main/tab.configuration.ts': 'ui/utils/configs/definitivas-main/tab.configuration.ts',
    '_ui/utils/configs/definitivas-main/table.config.ts': 'ui/utils/configs/definitivas-main/table.config.ts',

    '_ui/components/operaciones/components/button-contact/button-contact.component.css': 'ui/components/operaciones/components/button-contact/button-contact.component.css',
    '_ui/components/operaciones/components/button-contact/button-contact.component.html': 'ui/components/operaciones/components/button-contact/button-contact.component.html',
    '_ui/components/operaciones/components/button-contact/button-contact.component.spec.ts': 'ui/components/operaciones/components/button-contact/button-contact.component.spec.ts',
    '_ui/components/operaciones/components/button-contact/button-contact.component.ts': 'ui/components/operaciones/components/button-contact/button-contact.component.ts',

    '_ui/components/operaciones/components/layout/layout.component.css': 'ui/components/operaciones/components/layout/layout.component.css',
    '_ui/components/operaciones/components/layout/layout.component.html': 'ui/components/operaciones/components/layout/layout.component.html',
    '_ui/components/operaciones/components/layout/layout.component.spec.ts': 'ui/components/operaciones/components/layout/layout.component.spec.ts',
    '_ui/components/operaciones/components/layout/layout.component.ts': 'ui/components/operaciones/components/layout/layout.component.ts',

    '_ui/components/operaciones/components/home/home.component.html': 'ui/components/operaciones/components/home/home.component.html',
    '_ui/components/operaciones/components/home/home.component.scss': 'ui/components/operaciones/components/home/home.component.scss',
    '_ui/components/operaciones/components/home/home.component.spec.ts': 'ui/components/operaciones/components/home/home.component.spec.ts',
    '_ui/components/operaciones/components/home/home.component.ts': 'ui/components/operaciones/components/home/home.component.ts',

    '_ui/components/payment/components/payment-layout/payment-layout.component.css': 'ui/components/payment/components/payment-layout/payment-layout.component.css',
    '_ui/components/payment/components/payment-layout/payment-layout.component.html': 'ui/components/payment/components/payment-layout/payment-layout.component.html',
    '_ui/components/payment/components/payment-layout/payment-layout.component.spec.ts': 'ui/components/payment/components/payment-layout/payment-layout.component.spec.ts',
    '_ui/components/payment/components/payment-layout/payment-layout.component.ts': 'ui/components/payment/components/payment-layout/payment-layout.component.ts'
};


const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Usar process.cwd() para obtener el directorio de trabajo actual
const repoRoot = process.cwd();

function moveFile(sourcePath, destinationPath) {
  const absoluteSourcePath = path.join(repoRoot, sourcePath).replace(/\\/g, '/');
  const absoluteDestinationPath = path.join(repoRoot, destinationPath).replace(/\\/g, '/');

  // Verificar las rutas construidas
  console.log(`Intentando mover de: ${absoluteSourcePath} a ${absoluteDestinationPath}`);

  if (!fs.existsSync(absoluteSourcePath)) {
    console.error(`El archivo no existe: ${absoluteSourcePath}`);
    return;
  }

  const command = `git mv '${absoluteSourcePath}' '${absoluteDestinationPath}'`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al mover el archivo: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error al mover el archivo: ${stderr}`);
      return;
    }
    console.log(`Archivo movido: ${absoluteSourcePath} -> ${absoluteDestinationPath}`);
  });
}



// Mover los archivos a sus carpetas de destino
Object.entries(fileMapping).forEach(([sourcePath, destinationPath]) => {
  moveFile(sourcePath, destinationPath);
});





