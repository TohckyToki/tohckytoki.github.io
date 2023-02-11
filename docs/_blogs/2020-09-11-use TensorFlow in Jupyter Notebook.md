---
title: 在Jupyter Notebook中使用TensorFlow
date: 2020-09-11
author: YuengFu
isOriginal: true
category:
  - Blog
tag:
  - Jupyter Notebook
  - TensorFlow
---
## Jupyter Notebook的环境配置

首先需要下载安装[Anaconda](https://www.anaconda.com/products/individual)

由于我现在使用的最新版本Anaconda自带的Python版本是3.8.5，而截止到写作这篇文章的时候，TensorFlow只支持3.5.X,3.6.X,3.7.X版本的Python，所以安装TensorFlow时需要创建一个新Python 3.7的环境

创建名为tensorflow的python为3.7的环境
``` powershell
conda create -n tensorflow python=3.7
```
激活新创建的环境
``` powershell
conda activate tensorflow
```

由于我只需要tensorflow,所以这里只安装tensorflow，需要其他包可以自行conda或者pip安装
``` powershell
conda install tensorflow
```

安装jupyter
``` powershell
conda install ipython
conda install jupyter
```

启动notebook
``` powershell
jupyter notebook
```

## 使用TensorFlow

下面是notebook上的操作，参考了官网的[新手教程](https://tensorflow.google.cn/tutorials/quickstart/beginner?hl=zh-cn)


```python
import tensorflow as tf
```


```python
mnist = tf.keras.datasets.mnist
```


```python
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0
```

    Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/mnist.npz
    11493376/11490434 [==============================] - 102s 9us/step


上面这一步由于需要从google下载数据，需要连接外网


```python
model = tf.keras.models.Sequential([
  tf.keras.layers.Flatten(input_shape=(28, 28)),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dropout(0.2),
  tf.keras.layers.Dense(10, activation='softmax')
])
```


```python
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])
```


```python
model.fit(x_train, y_train, epochs=5)
```

    Epoch 1/5
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.2979 - accuracy: 0.9137
    Epoch 2/5
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.1435 - accuracy: 0.9573
    Epoch 3/5
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.1071 - accuracy: 0.9677
    Epoch 4/5
    1875/1875 [==============================] - 5s 3ms/step - loss: 0.0888 - accuracy: 0.9728
    Epoch 5/5
    1875/1875 [==============================] - 5s 2ms/step - loss: 0.0750 - accuracy: 0.9764





    <tensorflow.python.keras.callbacks.History at 0x7fa24c207510>




```python
model.evaluate(x_test,  y_test, verbose=2)
```

    313/313 - 0s - loss: 0.0764 - accuracy: 0.9749





    [0.07642737776041031, 0.9749000072479248]



以上为在jypyter中使用Tensorflow的教程，由于本人是第一次使用python和anaconda以及tensorflow，教程中有不足之处还请谅解。
