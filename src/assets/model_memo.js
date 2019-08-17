/*
ボクセル構造のまとめ
ボクセルデータは立方体の中心座標のみ
→中心座標から立方体の頂点データを作成
全体が同じ量だけ平行移動していても問題ないため、左下をボクセル座標の点として頂点データを作成

データ構造
面=[
        [i,j,k,colorindex],
        [i,j,k,colorindex],
        [i,j,k,colorindex],
        [i,j,k,colorindex],
    ]

点=[
        [x,y,z],
        [x,y,z],
        [x,y,z],
        [x,y,z],
        [x,y,z],
        [x,y,z],
    ]

color=[
        rgb,
        rgb,
        rgb,
        rgb
    ]

面に使用している頂点だけを使う＋面の要素に点のインデックスを使用

必要な面を計算
    隣にボクセルがある場合面を追加しない
    面は左下の起点と方向から定まる一意の値になる
    （1，1，1、右）と（2，1，1、左）が同じ面
    （1，1，1，上）と（1，2，1、下）が同じ
    （1，1，1，左）と（0、1，1、右）が同じ

    方角を計算する単位
    base_side = {
        "top":np.array([0,0,0.5]),"bottom":np.array([0,0,-0.5]),
        "rigth":np.array([0,0,0.5]),"left":np.array([0,0,-0.5]),
        "rear":np.array([0,0,0.5]),"front":np.array([0,0,-0.5])
    }

    この値を基準点に足すことで面の比較を行う

    タプルはキーにできるので
        facedict={}
        for k,v in base_side.items():
            facetuple=tuple(np.array(voxel[:3]) + v)
            if facetuple in facedict.keys():
                facedict.pop(facetuple)
                #print("exist",facetuple)
            else:
                facedict[facetuple] = voxel,k

    重複なしの面の向きを取得
     facedictの値は重複なしの描画するべき面の向き
        ([2, 6, 14, 16764006], 'top')
        ([2, 6, 14, 16764006], 'bottom')
        ([2, 6, 14, 16764006], 'rigth')
    を表す

    この値から頂点と面の値を取得する

    そのためにvertex,faceの両方を辞書型として方向から計算が必要な要素を指定する
        base_vertex = {
        "top":np.array([[0,0,1],[0,1,1],[1,1,1],[1,0,1]]),
        "bottom":np.array([0,0,0],[0,1,0],[1,1,0],[1,0,0]),
        "right":np.array([1,0,0],[1,0,1],[1,1,1],[1,1,0]),
        "left":np.array([0,0,0],[0,0,1],[0,1,1],[0,1,0]),
        "front":np.array([0,0,0],[0,0,1],[1,0,1],[1,0,0]),
        "rear":np.array([0,1,0],[0,1,1],[1,1,1],[1,1,0])
    }
    base_face = [[0,1,2],[2,3,0]]

    vertexには面を構成するのに必要な４点を保持
    使用するときは
    vertex    voxelの基点+base_vertex["top"]
    face      ↑の点の配列の0，1，2点と2，3，0点の２つの三角形






*/
