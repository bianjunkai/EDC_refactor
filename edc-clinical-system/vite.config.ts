import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'

  return {
    plugins: [
      react(),
      // 打包分析（仅在 analyze 模式下启用）
      isAnalyze &&
        visualizer({
          open: true,
          gzipSize: true,
          brotliSize: true,
          filename: 'dist/stats.html',
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      host: true,
    },
    build: {
      // 代码分割优化
      rollupOptions: {
        output: {
          // 代码分块策略
          manualChunks: {
            // 框架核心
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Ant Design 单独打包
            'vendor-antd': ['antd', '@ant-design/icons', '@ant-design/cssinjs'],
            // 工具库
            'vendor-utils': ['dayjs'],
          },
          // 资源文件命名
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || ''
            if (info.endsWith('.css')) {
              return 'assets/css/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(info)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      // 压缩配置（使用 esbuild，内置无需安装）
      minify: 'esbuild',
      // 启用 esbuild 压缩时移除 console（仅生产环境）
      esbuildOptions: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      // 启用 source map（生产环境可关闭）
      sourcemap: mode !== 'production',
      // 构建优化
      target: 'es2015',
      cssTarget: 'chrome61',
      // 报告压缩后大小
      reportCompressedSize: true,
      // 块大小警告阈值
      chunkSizeWarningLimit: 500,
    },
    // 预构建优化
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'antd', 'dayjs'],
      exclude: [],
    },
    // CSS 优化
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  }
})
