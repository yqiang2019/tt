<!DOCTYPE html>
<html>
<head>
    <title>打印管理系统</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
    <script src="https://jsprintmanager.azurewebsites.net/scripts/JSPrintManager.js"></script>
    <style>
        .status-ok { color: green; }
        .status-error { color: red; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div id="status"></div>
    <select id="printerSelect"></select>
    <button onclick="printText()">打印文本</button>
    <button onclick="printPDF()">打印PDF</button>
    <button onclick="getPrinterStatus()">获取打印机状态</button>
    <div id="printQueue"></div>
</body>
</html>


// 打印管理类
class PrintManager {
    constructor() {
        this.isInitialized = false;
        this.printers = [];
        this.currentPrinter = null;
        this.init();
    }

    async init() {
        try {
            // 启动 JSPrintManager
            JSPM.JSPrintManager.auto_reconnect = true;
            await JSPM.JSPrintManager.start();

            // 检查安装状态
            const installed = await this.checkInstallation();
            if (!installed) {
                this.updateStatus('请安装 JSPrintManager', 'error');
                return;
            }

            // 初始化事件监听
            this.setupEventListeners();
            
            // 获取打印机列表
            await this.loadPrinters();
            
            this.isInitialized = true;
            this.updateStatus('系统就绪', 'ok');
        } catch (error) {
            this.updateStatus(`初始化失败: ${error.message}`, 'error');
        }
    }

    async checkInstallation() {
        for (let i = 0; i < 3; i++) {  // 重试3次
            if (await JSPM.JSPrintManager.isInstalled()) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return false;
    }

    setupEventListeners() {
        JSPM.JSPrintManager.on('websocketStatusChanged', () => {
            const status = JSPM.JSPrintManager.websocketStatus;
            this.updateStatus(`WebSocket状态: ${status}`, 
                status === JSPM.WebSocketStatus.Open ? 'ok' : 'error');
        });

        JSPM.JSPrintManager.on('printersChanged', () => {
            this.loadPrinters();
        });
    }

    async loadPrinters() {
        try {
            this.printers = await JSPM.JSPrintManager.getPrinters();
            const select = document.getElementById('printerSelect');
            select.innerHTML = '';
            
            this.printers.forEach(printer => {
                const option = document.createElement('option');
                option.value = printer;
                option.textContent = printer;
                select.appendChild(option);
            });

            // 设置默认打印机
            this.currentPrinter = this.printers[0];
        } catch (error) {
            this.updateStatus(`获取打印机列表失败: ${error.message}`, 'error');
        }
    }

    async printText(text, options = {}) {
        try {
            if (!this.isInitialized) {
                throw new Error('系统未初始化');
            }

            const cpj = new JSPM.ClientPrintJob();
            const printer = new JSPM.InstalledPrinter(this.currentPrinter);
            
            // 设置打印参数
            printer.paperName = options.paperName || "A4";
            printer.trayName = options.trayName || "";
            printer.duplex = options.duplex || JSPM.DuplexMode.Simplex;
            printer.copies = options.copies || 1;

            cpj.clientPrinter = printer;

            // 创建打印内容
            const printContent = new JSPM.PrintText();
            printContent.text = text;
            printContent.font = options.font || "Arial";
            printContent.fontSize = options.fontSize || 12;
            printContent.alignment = options.alignment || JSPM.TextAlignment.Left;

            cpj.files.push(printContent);

            // 发送打印任务
            await cpj.sendToClient();
            this.updateStatus('打印任务已发送', 'ok');
        } catch (error) {
            this.updateStatus(`打印失败: ${error.message}`, 'error');
        }
    }

    async printPDF(pdfUrl, options = {}) {
        try {
            if (!this.isInitialized) {
                throw new Error('系统未初始化');
            }

            const cpj = new JSPM.ClientPrintJob();
            const printer = new JSPM.InstalledPrinter(this.currentPrinter);
            
            // 设置打印参数
            Object.assign(printer, options);
            cpj.clientPrinter = printer;

            // 创建PDF打印任务
            const pdf = new JSPM.PrintFilePDF(
                pdfUrl,
                JSPM.FileSourceType.URL,
                options.documentName || "Document",
                options.pages || 0
            );

            cpj.files.push(pdf);
            await cpj.sendToClient();
            this.updateStatus('PDF打印任务已发送', 'ok');
        } catch (error) {
            this.updateStatus(`PDF打印失败: ${error.message}`, 'error');
        }
    }

    async getPrinterStatus() {
        try {
            if (!this.currentPrinter) {
                throw new Error('未选择打印机');
            }

            const printer = new JSPM.InstalledPrinter(this.currentPrinter);
            const status = await printer.getStatus();
            this.updateStatus(`打印机状态: ${status}`, 'ok');
            return status;
        } catch (error) {
            this.updateStatus(`获取状态失败: ${error.message}`, 'error');
        }
    }

    updateStatus(message, type = 'ok') {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status-${type}`;
        console.log(`[PrintManager] ${message}`);
    }
}

// 创建全局实例
const printManager = new PrintManager();

// 界面交互函数
async function printText() {
    const text = "测试打印内容\n这是第二行\n这是第三行";
    await printManager.printText(text, {
        fontSize: 14,
        copies: 1,
        paperName: "A4"
    });
}

async function printPDF() {
    const pdfUrl = "https://example.com/sample.pdf";
    await printManager.printPDF(pdfUrl, {
        copies: 1,
        documentName: "测试PDF",
        pages: "1-3"
    });
}

async function getPrinterStatus() {
    await printManager.getPrinterStatus();
}



// 打印文本示例
printManager.printText("Hello World", {
    font: "Arial",
    fontSize: 12,
    copies: 2,
    paperName: "A4",
    alignment: JSPM.TextAlignment.Center
});

// 打印PDF示例
printManager.printPDF("https://example.com/document.pdf", {
    copies: 1,
    documentName: "重要文档",
    pages: "1-5",
    paperName: "A4",
    duplex: JSPM.DuplexMode.Duplex
});


<!DOCTYPE html>
<html>
<head>
    <title>扫描管理</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.5/bluebird.min.js"></script>
    <script src="https://jsprintmanager.azurewebsites.net/scripts/JSPrintManager.js"></script>
</head>
<body>
    <div id="status"></div>
    <div>
        <select id="scannerSelect"></select>
        <button onclick="startScan()">开始扫描</button>
        <button onclick="getScannerStatus()">获取扫描仪状态</button>
    </div>
    <div>
        <label>DPI:</label>
        <select id="dpiSelect">
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300" selected>300</option>
        </select>
        
        <label>颜色模式:</label>
        <select id="colorMode">
            <option value="Grayscale">灰度</option>
            <option value="Color">彩色</option>
        </select>
    </div>
    <div id="scanPreview"></div>
</body>
</html>


class ScannerManager {
    constructor() {
        this.isInitialized = false;
        this.scanners = [];
        this.currentScanner = null;
        this.init();
    }

    async init() {
        try {
            // 启动 JSPrintManager
            JSPM.JSPrintManager.auto_reconnect = true;
            await JSPM.JSPrintManager.start();

            if (await this.checkInstallation()) {
                await this.loadScanners();
                this.setupEventListeners();
                this.isInitialized = true;
                this.updateStatus('扫描系统就绪', 'ok');
            } else {
                this.updateStatus('请安装 JSPrintManager', 'error');
            }
        } catch (error) {
            this.updateStatus(`初始化失败: ${error.message}`, 'error');
        }
    }

    async checkInstallation() {
        return await JSPM.JSPrintManager.isInstalled();
    }

    async loadScanners() {
        try {
            // 获取可用的扫描仪列表
            let scanners = await JSPM.Scanner.getDevices();
            this.scanners = scanners;

            const select = document.getElementById('scannerSelect');
            select.innerHTML = '';
            
            scanners.forEach(scanner => {
                const option = document.createElement('option');
                option.value = scanner.name;
                option.textContent = scanner.name;
                select.appendChild(option);
            });

            if (scanners.length > 0) {
                this.currentScanner = scanners[0];
            }
        } catch (error) {
            this.updateStatus(`获取扫描仪列表失败: ${error.message}`, 'error');
        }
    }

    async scan(options = {}) {
        try {
            if (!this.isInitialized) {
                throw new Error('系统未初始化');
            }

            const scanner = new JSPM.Scanner(this.currentScanner.name);

            // 设置扫描参数
            scanner.dpi = parseInt(options.dpi || 300);
            scanner.pixelMode = options.colorMode === 'Color' ? 
                JSPM.PixelMode.Color : JSPM.PixelMode.Grayscale;
            
            // 可选参数设置
            scanner.brightness = options.brightness || 0;
            scanner.contrast = options.contrast || 0;
            scanner.pageSize = options.pageSize || JSPM.Scanner.PageSize.A4;
            scanner.pageOrientation = options.orientation || 
                JSPM.Scanner.PageOrientation.Portrait;

            // 开始扫描
            this.updateStatus('开始扫描...', 'ok');
            const scanResult = await scanner.scan();

            // 处理扫描结果
            this.handleScanResult(scanResult);
            
        } catch (error) {
            this.updateStatus(`扫描失败: ${error.message}`, 'error');
        }
    }

    handleScanResult(result) {
        if (result.success) {
            // 显示扫描预览
            const preview = document.getElementById('scanPreview');
            preview.innerHTML = '';

            result.images.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = 'data:image/png;base64,' + image;
                img.style.maxWidth = '100%';
                img.style.marginBottom = '10px';
                preview.appendChild(img);

                // 添加下载按钮
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = `下载第${index + 1}页`;
                downloadBtn.onclick = () => this.downloadImage(image, index);
                preview.appendChild(downloadBtn);
            });

            this.updateStatus(`扫描完成，共${result.images.length}页`, 'ok');
        } else {
            this.updateStatus('扫描失败', 'error');
        }
    }

    downloadImage(base64Data, pageIndex) {
        const link = document.createElement('a');
        link.href = 'data:image/png;base64,' + base64Data;
        link.download = `scan_page_${pageIndex + 1}.png`;
        link.click();
    }

    async getScannerStatus() {
        try {
            if (!this.currentScanner) {
                throw new Error('未选择扫描仪');
            }

            const scanner = new JSPM.Scanner(this.currentScanner.name);
            const status = await scanner.getStatus();
            this.updateStatus(`扫描仪状态: ${status}`, 'ok');
            return status;
        } catch (error) {
            this.updateStatus(`获取状态失败: ${error.message}`, 'error');
        }
    }

    updateStatus(message, type = 'ok') {
        const statusDiv = document.getElementById('status');
        statusDiv.textContent = message;
        statusDiv.className = `status-${type}`;
        console.log(`[ScannerManager] ${message}`);
    }
}

// 创建全局实例
const scannerManager = new ScannerManager();

// 界面交互函数
async function startScan() {
    const dpi = document.getElementById('dpiSelect').value;
    const colorMode = document.getElementById('colorMode').value;
    
    await scannerManager.scan({
        dpi: dpi,
        colorMode: colorMode,
        pageSize: JSPM.Scanner.PageSize.A4,
        orientation: JSPM.Scanner.PageOrientation.Portrait
    });
}

async function getScannerStatus() {
    await scannerManager.getScannerStatus();
}

// 批量扫描设置
async function batchScan() {
    const options = {
        dpi: 300,
        colorMode: 'Color',
        pageSize: JSPM.Scanner.PageSize.A4,
        orientation: JSPM.Scanner.PageOrientation.Portrait,
        // 高级选项
        duplex: true,  // 双面扫描
        feeder: true,  // 使用送纸器
        autoFeeder: true,  // 自动送纸
        autoRotate: true,  // 自动旋转
        autoSize: true,    // 自动检测页面大小
        maxPages: 10       // 最大扫描页数
    };

    await scannerManager.scan(options);
}

// 自定义图像处理
function processScannedImage(imageData) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 绘制图像
            ctx.drawImage(img, 0, 0);
            
            // 图像处理（例如：调整亮度/对比度）
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // ... 进行图像处理
            
            resolve(canvas.toDataURL('image/png'));
        };
        img.src = imageData;
    });
}